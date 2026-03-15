"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoom = void 0;
const crypto_1 = require("crypto");
const persistence_1 = require("./persistence");
const DEAD_DROP_TTL = 24 * 60 * 60 * 1000;
const ACTIVE_TTL = 6 * 60 * 60 * 1000;
const BURN_TTL = 5 * 60 * 1000;
const MAX_CONNECTIONS = 50;
const RATE_LIMIT_MS = 1000;
const MAX_BUFFER = 50;
const MAX_PAYLOAD_SIZE = 12000; // 8192 padded plaintext + NaCl overhead + base64 ≈ 11KB
const ROOM_IDLE_TTL = 5 * 60 * 1000; // garbage collect empty rooms after 5 min
class ChatRoom {
    roomId;
    onEmpty;
    messages = [];
    rateLimits = new Map();
    burnTimers = new Map();
    connectionTokens = new Map();
    connections = new Map();
    roomLastMessage = 0;
    roomMessageCount = 0;
    hasHadReply = false;
    idleTimer = null;
    persistTimer = null;
    constructor(roomId, onEmpty) {
        this.roomId = roomId;
        this.onEmpty = onEmpty;
        // Hydrate from disk if persisted state exists
        const persisted = (0, persistence_1.loadRoom)(roomId);
        if (persisted) {
            this.messages = persisted.messages;
            this.hasHadReply = persisted.hasHadReply;
            // Restart burn timers for messages already marked as read
            const now = Date.now();
            for (const msg of this.messages) {
                if (msg.readAt !== null) {
                    const remaining = msg.expiresAt - now;
                    if (remaining > 0) {
                        this.restartBurnTimer(msg, remaining);
                    }
                }
            }
        }
    }
    persist() {
        // Debounce: batch rapid mutations into a single write
        if (this.persistTimer)
            return;
        this.persistTimer = setTimeout(() => {
            this.persistTimer = null;
            if (this.messages.length === 0) {
                (0, persistence_1.deleteRoom)(this.roomId);
            }
            else {
                (0, persistence_1.saveRoom)(this.roomId, {
                    messages: this.messages,
                    hasHadReply: this.hasHadReply,
                });
            }
        }, 200);
    }
    getConnections() {
        return [...this.connections.values()];
    }
    broadcast(data) {
        const buf = Buffer.from(data);
        for (const conn of this.getConnections()) {
            if (conn.ws.readyState === 1)
                conn.ws.send(buf);
        }
    }
    send(conn, data) {
        if (conn.ws.readyState === 1)
            conn.ws.send(Buffer.from(data));
    }
    getSenderToken(connectionId) {
        return this.connectionTokens.get(connectionId) || connectionId;
    }
    pruneExpired() {
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
            this.broadcast(JSON.stringify({ type: "deleted", ids }));
            if (this.messages.length === 0)
                this.hasHadReply = false;
            this.persist();
        }
    }
    restartBurnTimer(msg, remaining) {
        if (this.burnTimers.has(msg.id))
            return;
        const timer = setTimeout(() => {
            this.burnTimers.delete(msg.id);
            this.messages = this.messages.filter((m) => m.id !== msg.id);
            this.broadcast(JSON.stringify({ type: "deleted", ids: [msg.id] }));
            if (this.messages.length === 0)
                this.hasHadReply = false;
            this.persist();
        }, remaining);
        this.burnTimers.set(msg.id, timer);
    }
    startBurnTimer(msg) {
        if (this.burnTimers.has(msg.id))
            return;
        const now = Date.now();
        msg.readAt = now;
        msg.expiresAt = now + BURN_TTL;
        this.broadcast(JSON.stringify({ type: "burn", id: msg.id, burnAt: msg.expiresAt }));
        const timer = setTimeout(() => {
            this.burnTimers.delete(msg.id);
            this.messages = this.messages.filter((m) => m.id !== msg.id);
            this.broadcast(JSON.stringify({ type: "deleted", ids: [msg.id] }));
            if (this.messages.length === 0)
                this.hasHadReply = false;
            this.persist();
        }, BURN_TTL);
        this.burnTimers.set(msg.id, timer);
        this.persist();
    }
    broadcastPresence() {
        const count = this.connections.size;
        this.broadcast(JSON.stringify({ type: "presence", othersHere: count > 1 }));
    }
    resetIdleTimer() {
        if (this.idleTimer)
            clearTimeout(this.idleTimer);
        this.idleTimer = null;
    }
    startIdleTimer() {
        if (this.connections.size > 0)
            return;
        if (this.messages.length > 0)
            return;
        this.idleTimer = setTimeout(() => {
            this.destroy();
            this.onEmpty(this.roomId);
        }, ROOM_IDLE_TTL);
    }
    destroy() {
        for (const timer of this.burnTimers.values())
            clearTimeout(timer);
        this.burnTimers.clear();
        if (this.idleTimer)
            clearTimeout(this.idleTimer);
        if (this.persistTimer)
            clearTimeout(this.persistTimer);
        (0, persistence_1.deleteRoom)(this.roomId);
    }
    onConnect(ws) {
        this.resetIdleTimer();
        const connId = (0, crypto_1.randomUUID)();
        if (this.connections.size >= MAX_CONNECTIONS) {
            ws.send(JSON.stringify({ type: "error", code: "ROOM_FULL" }));
            ws.close();
            return connId;
        }
        const conn = { id: connId, ws };
        this.connections.set(connId, conn);
        this.pruneExpired();
        // If others are now here, start burn timers on all unread messages
        if (this.connections.size > 1) {
            for (const msg of this.messages) {
                if (msg.readAt === null)
                    this.startBurnTimer(msg);
            }
        }
        this.persist();
        // Send history
        const history = this.messages.slice(-MAX_BUFFER).map((m) => ({
            payload: m.payload,
            id: m.id,
            ts: m.ts,
            burnAt: m.readAt !== null ? m.expiresAt : null,
            expiresAt: m.expiresAt,
        }));
        this.send(conn, JSON.stringify({ type: "history", messages: history }));
        this.broadcastPresence();
        return connId;
    }
    onMessage(message, connId) {
        const conn = this.connections.get(connId);
        if (!conn)
            return;
        let parsed;
        try {
            parsed = JSON.parse(message);
        }
        catch {
            return;
        }
        if (parsed.type === "identify" && parsed.token) {
            this.connectionTokens.set(connId, parsed.token);
            return;
        }
        const senderToken = this.getSenderToken(connId);
        if (parsed.type === "acknowledge" && parsed.ids && Array.isArray(parsed.ids)) {
            for (const msg of this.messages) {
                if (parsed.ids.includes(msg.id) && msg.readAt === null && msg.senderId !== senderToken) {
                    this.startBurnTimer(msg);
                }
            }
            this.persist();
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
            if (this.messages.length === 0)
                this.hasHadReply = false;
            if (deletedIds.length > 0) {
                this.broadcast(JSON.stringify({ type: "deleted", ids: deletedIds }));
            }
            this.persist();
            this.rateLimits.delete(connId);
            conn.ws.close();
            return;
        }
        // Decoy traffic: relay to other clients but do NOT store, rate-limit, or
        // affect TTL/dead-drop logic. Network observers still see identical frames.
        if (parsed.type === "decoy" && parsed.payload) {
            if (parsed.payload.length > MAX_PAYLOAD_SIZE)
                return;
            for (const c of this.getConnections()) {
                if (c.id !== connId && c.ws.readyState === 1) {
                    c.ws.send(Buffer.from(JSON.stringify({
                        type: "message",
                        payload: parsed.payload,
                        id: (0, crypto_1.randomUUID)(),
                        ts: Date.now(),
                        expiresAt: Date.now() + 60000, // short expiry, client discards via nop
                    })));
                }
            }
            return;
        }
        if (parsed.type !== "message" || !parsed.payload)
            return;
        if (parsed.payload.length > MAX_PAYLOAD_SIZE)
            return;
        const now = Date.now();
        // Per-connection rate limit
        const lastTime = this.rateLimits.get(connId) || 0;
        if (now - lastTime < RATE_LIMIT_MS) {
            this.send(conn, JSON.stringify({ type: "error", code: "RATE_LIMITED" }));
            return;
        }
        this.rateLimits.set(connId, now);
        // Room-level flood protection
        if (now - this.roomLastMessage < 1000) {
            this.roomMessageCount++;
            if (this.roomMessageCount > 10) {
                this.send(conn, JSON.stringify({ type: "error", code: "RATE_LIMITED" }));
                return;
            }
        }
        else {
            this.roomLastMessage = now;
            this.roomMessageCount = 1;
        }
        const existingSenders = new Set(this.messages.map((m) => m.senderId));
        const isReply = existingSenders.size > 0 && !existingSenders.has(senderToken);
        if (isReply) {
            this.hasHadReply = true;
            for (const msg of this.messages) {
                if (msg.readAt === null)
                    this.startBurnTimer(msg);
            }
        }
        const ttl = this.hasHadReply ? ACTIVE_TTL : DEAD_DROP_TTL;
        const id = (0, crypto_1.randomUUID)();
        const storedMsg = {
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
            const evictedIds = evicted.map((m) => m.id);
            for (const eid of evictedIds) {
                const timer = this.burnTimers.get(eid);
                if (timer) {
                    clearTimeout(timer);
                    this.burnTimers.delete(eid);
                }
            }
            this.broadcast(JSON.stringify({ type: "deleted", ids: evictedIds }));
        }
        this.broadcast(JSON.stringify({
            type: "message",
            payload: parsed.payload,
            id,
            ts: now,
            expiresAt: storedMsg.expiresAt,
        }));
        this.send(conn, JSON.stringify({ type: "confirmed", id }));
        if (this.connections.size > 1) {
            this.startBurnTimer(storedMsg);
        }
        this.persist();
    }
    onClose(connId) {
        this.connectionTokens.delete(connId);
        this.rateLimits.delete(connId);
        this.connections.delete(connId);
        this.broadcastPresence();
        this.startIdleTimer();
    }
}
exports.ChatRoom = ChatRoom;
