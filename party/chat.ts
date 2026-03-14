import type * as Party from "partykit/server";

interface StoredMessage {
  id: string;
  payload: string;
  ts: number;
  senderId: string; // session token, stable across reconnects
  readAt: number | null;
  expiresAt: number;
}

interface RoomState {
  messages: StoredMessage[];
  hasHadReply: boolean;
}

const DEAD_DROP_TTL = 24 * 60 * 60 * 1000; // 24 hours — first message ceiling
const ACTIVE_TTL = 6 * 60 * 60 * 1000; // 6 hours — subsequent messages
const BURN_TTL = 5 * 60 * 1000; // 5 minutes after acknowledged/replied
const MAX_CONNECTIONS = 50;
const RATE_LIMIT_MS = 1000;
const MAX_BUFFER = 50;
const MAX_PAYLOAD_SIZE = 8192;

export default class ChatRoom implements Party.Server {
  private messages: StoredMessage[] = [];
  private rateLimits = new Map<string, number>();
  private burnTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private connectionTokens = new Map<string, string>(); // connection.id → session token
  private roomLastMessage = 0;
  private roomMessageCount = 0;
  private hasHadReply = false;

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const state = await this.room.storage.get<RoomState>("state");
    if (state) {
      const now = Date.now();
      this.messages = state.messages.filter((m) => m.expiresAt > now);
      this.hasHadReply = this.messages.length > 0 ? state.hasHadReply : false;

      for (const msg of this.messages) {
        if (msg.readAt !== null) {
          const remaining = msg.expiresAt - now;
          if (remaining > 0) {
            this.restartBurnTimer(msg, remaining);
          }
        }
      }

      await this.persistState();
    }
  }

  private async persistState() {
    await this.room.storage.put<RoomState>("state", {
      messages: this.messages,
      hasHadReply: this.hasHadReply,
    });
  }

  private getSenderToken(connectionId: string): string {
    return this.connectionTokens.get(connectionId) || connectionId;
  }

  private async pruneExpired() {
    const now = Date.now();
    const expired = this.messages.filter((m) => m.expiresAt <= now);
    if (expired.length > 0) {
      const ids = expired.map((m) => m.id);
      this.messages = this.messages.filter((m) => m.expiresAt > now);
      for (const id of ids) {
        const timer = this.burnTimers.get(id);
        if (timer) {
          clearTimeout(timer);
          this.burnTimers.delete(id);
        }
      }
      const broadcast = JSON.stringify({ type: "deleted", ids });
      for (const conn of this.room.getConnections()) {
        conn.send(broadcast);
      }
      if (this.messages.length === 0) this.hasHadReply = false;
      await this.persistState();
    }
  }

  private restartBurnTimer(msg: StoredMessage, remaining: number) {
    if (this.burnTimers.has(msg.id)) return;

    const timer = setTimeout(async () => {
      this.burnTimers.delete(msg.id);
      this.messages = this.messages.filter((m) => m.id !== msg.id);
      const broadcast = JSON.stringify({ type: "deleted", ids: [msg.id] });
      for (const conn of this.room.getConnections()) {
        conn.send(broadcast);
      }
      if (this.messages.length === 0) this.hasHadReply = false;
      await this.persistState();
    }, remaining);

    this.burnTimers.set(msg.id, timer);
  }

  private async startBurnTimer(msg: StoredMessage) {
    if (this.burnTimers.has(msg.id)) return;

    const now = Date.now();
    msg.readAt = now;
    msg.expiresAt = now + BURN_TTL;

    const burnNotice = JSON.stringify({
      type: "burn",
      id: msg.id,
      burnAt: msg.expiresAt,
    });
    for (const conn of this.room.getConnections()) {
      conn.send(burnNotice);
    }

    const timer = setTimeout(async () => {
      this.burnTimers.delete(msg.id);
      this.messages = this.messages.filter((m) => m.id !== msg.id);
      const broadcast = JSON.stringify({ type: "deleted", ids: [msg.id] });
      for (const conn of this.room.getConnections()) {
        conn.send(broadcast);
      }
      if (this.messages.length === 0) this.hasHadReply = false;
      await this.persistState();
    }, BURN_TTL);

    this.burnTimers.set(msg.id, timer);
    await this.persistState();
  }

  private broadcastPresence() {
    const count = [...this.room.getConnections()].length;
    const msg = JSON.stringify({
      type: "presence",
      othersHere: count > 1,
    });
    for (const conn of this.room.getConnections()) {
      conn.send(msg);
    }
  }

  async onConnect(connection: Party.Connection) {
    const count = [...this.room.getConnections()].length;

    if (count > MAX_CONNECTIONS) {
      connection.send(
        JSON.stringify({ type: "error", code: "ROOM_FULL" })
      );
      connection.close();
      return;
    }

    await this.pruneExpired();

    // If others are now here, start burn timers on all unread messages
    if (count > 1) {
      for (const msg of this.messages) {
        if (msg.readAt === null) {
          await this.startBurnTimer(msg);
        }
      }
    }

    // Send history with burn info
    const history = this.messages.slice(-MAX_BUFFER).map((m) => ({
      payload: m.payload,
      id: m.id,
      ts: m.ts,
      burnAt: m.readAt !== null ? m.expiresAt : null,
      expiresAt: m.expiresAt,
    }));
    connection.send(JSON.stringify({ type: "history", messages: history }));

    this.broadcastPresence();
  }

  async onMessage(message: string | ArrayBuffer, sender: Party.Connection) {
    const str = message instanceof ArrayBuffer
      ? new TextDecoder().decode(message)
      : typeof message === "string" ? message : String(message);
    let parsed: { type: string; payload?: string; ids?: string[]; token?: string };
    try {
      parsed = JSON.parse(str);
    } catch {
      return;
    }

    // Register session token for this connection
    if (parsed.type === "identify" && parsed.token) {
      this.connectionTokens.set(sender.id, parsed.token);
      return;
    }

    const senderToken = this.getSenderToken(sender.id);

    // Explicit acknowledge — recipient confirms they received messages
    if (parsed.type === "acknowledge" && parsed.ids && Array.isArray(parsed.ids)) {
      for (const msg of this.messages) {
        if (parsed.ids.includes(msg.id) && msg.readAt === null && msg.senderId !== senderToken) {
          await this.startBurnTimer(msg);
        }
      }
      return;
    }

    if (parsed.type === "terminate") {
      const deletedIds = this.messages
        .filter((m) => m.senderId === senderToken)
        .map((m) => m.id);

      for (const id of deletedIds) {
        const timer = this.burnTimers.get(id);
        if (timer) {
          clearTimeout(timer);
          this.burnTimers.delete(id);
        }
      }

      this.messages = this.messages.filter((m) => m.senderId !== senderToken);
      if (this.messages.length === 0) this.hasHadReply = false;

      if (deletedIds.length > 0) {
        const broadcast = JSON.stringify({ type: "deleted", ids: deletedIds });
        for (const conn of this.room.getConnections()) {
          conn.send(broadcast);
        }
      }

      this.rateLimits.delete(sender.id);
      await this.persistState();
      sender.close();
      return;
    }

    if (parsed.type !== "message" || !parsed.payload) return;
    if (parsed.payload.length > MAX_PAYLOAD_SIZE) return;

    const now = Date.now();

    // Per-connection rate limit
    const lastTime = this.rateLimits.get(sender.id) || 0;
    if (now - lastTime < RATE_LIMIT_MS) {
      sender.send(
        JSON.stringify({ type: "error", code: "RATE_LIMITED" })
      );
      return;
    }
    this.rateLimits.set(sender.id, now);

    // Room-level flood protection
    if (now - this.roomLastMessage < 1000) {
      this.roomMessageCount++;
      if (this.roomMessageCount > 10) {
        sender.send(
          JSON.stringify({ type: "error", code: "RATE_LIMITED" })
        );
        return;
      }
    } else {
      this.roomLastMessage = now;
      this.roomMessageCount = 1;
    }

    // Check if this is a new sender (reply from someone else)
    const existingSenders = new Set(this.messages.map((m) => m.senderId));
    const isReply = existingSenders.size > 0 && !existingSenders.has(senderToken);

    // If a new sender replies, burn all existing unread messages
    if (isReply) {
      this.hasHadReply = true;
      for (const msg of this.messages) {
        if (msg.readAt === null) {
          await this.startBurnTimer(msg);
        }
      }
    }

    const ttl = this.hasHadReply ? ACTIVE_TTL : DEAD_DROP_TTL;

    const id = crypto.randomUUID();
    const storedMsg: StoredMessage = {
      id,
      payload: parsed.payload,
      ts: now,
      senderId: senderToken,
      readAt: null,
      expiresAt: now + ttl,
    };
    this.messages.push(storedMsg);

    if (this.messages.length > MAX_BUFFER) {
      const evicted = this.messages.slice(0, this.messages.length - MAX_BUFFER);
      this.messages = this.messages.slice(-MAX_BUFFER);

      // Clean up timers for evicted messages and notify clients
      const evictedIds = evicted.map((m) => m.id);
      for (const id of evictedIds) {
        const timer = this.burnTimers.get(id);
        if (timer) {
          clearTimeout(timer);
          this.burnTimers.delete(id);
        }
      }
      const evictBroadcast = JSON.stringify({ type: "deleted", ids: evictedIds });
      for (const conn of this.room.getConnections()) {
        conn.send(evictBroadcast);
      }
    }

    const broadcast = JSON.stringify({
      type: "message",
      payload: parsed.payload,
      id,
      ts: now,
      expiresAt: storedMsg.expiresAt,
    });
    for (const conn of this.room.getConnections()) {
      conn.send(broadcast);
    }

    sender.send(JSON.stringify({ type: "confirmed", id }));

    // If others are in the room, message is read live — start 5min burn
    const connectionCount = [...this.room.getConnections()].length;
    if (connectionCount > 1) {
      await this.startBurnTimer(storedMsg);
    }

    await this.persistState();
  }

  onClose(connection: Party.Connection) {
    this.connectionTokens.delete(connection.id);
    this.rateLimits.delete(connection.id);
    this.broadcastPresence();
  }

  onError(connection: Party.Connection) {
    this.connectionTokens.delete(connection.id);
    this.rateLimits.delete(connection.id);
    this.broadcastPresence();
  }
}

ChatRoom satisfies Party.Worker;
