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
const MAX_PAYLOAD_SIZE = 22000; // 16384 padded plaintext + NaCl overhead + base64 ≈ 21.9KB
const ROOM_IDLE_TTL = 5 * 60 * 1000; // garbage collect empty rooms after 5 min
const HELLO_TIMEOUT = 10_000; // close connections that do not authenticate
const MAX_COVER_TIMERS = 200; // outstanding cover-traffic burn/delete timers per room
const MAX_ACK_IDS = 50;
const TOKEN_RE = /^[0-9a-f-]{36}$/;
const HEX64_RE = /^[0-9a-f]{64}$/;
function sha256Hex(value) {
    return (0, crypto_1.createHash)("sha256").update(value).digest("hex");
}
class ChatRoom {
    roomId;
    onEmpty;
    messages = [];
    rateLimits = new Map();
    burnTimers = new Map();
    coverTimers = new Set();
    connections = new Map();
    // SHA-256 of the access proof presented by the room's first member.
    verifier = null;
    roomLastMessage = 0;
    roomMessageCount = 0;
    hasHadReply = false;
    idleTimer = null;
    persistTimer = null;
    constructor(roomId, onEmpty) {
        this.roomId = roomId;
        this.onEmpty = onEmpty;
        // Hydrate from the RAM-backed store if persisted state exists
        const persisted = (0, persistence_1.loadRoom)(roomId);
        if (persisted) {
            this.messages = persisted.messages;
            this.hasHadReply = persisted.hasHadReply;
            this.verifier =
                typeof persisted.verifier === "string" && HEX64_RE.test(persisted.verifier)
                    ? persisted.verifier
                    : null;
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
                    verifier: this.verifier,
                });
            }
        }, 200);
    }
    members() {
        return [...this.connections.values()].filter((c) => c.authenticated);
    }
    memberCount() {
        let n = 0;
        for (const c of this.connections.values())
            if (c.authenticated)
                n++;
        return n;
    }
    /** Send to every authenticated member of the room. */
    broadcast(data) {
        const buf = Buffer.from(data);
        for (const conn of this.members()) {
            if (conn.ws.readyState === 1)
                conn.ws.send(buf);
        }
    }
    send(conn, data) {
        if (conn.ws.readyState === 1)
            conn.ws.send(Buffer.from(data));
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
        this.broadcast(JSON.stringify({ type: "presence", othersHere: this.memberCount() > 1 }));
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
        this.resetIdleTimer();
        this.idleTimer = setTimeout(() => {
            this.destroy();
            this.onEmpty(this.roomId);
        }, ROOM_IDLE_TTL);
    }
    destroy() {
        for (const timer of this.burnTimers.values())
            clearTimeout(timer);
        this.burnTimers.clear();
        for (const timer of this.coverTimers)
            clearTimeout(timer);
        this.coverTimers.clear();
        if (this.idleTimer)
            clearTimeout(this.idleTimer);
        if (this.persistTimer)
            clearTimeout(this.persistTimer);
        this.verifier = null;
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
        const conn = { id: connId, ws, authenticated: false, token: null, helloTimer: null };
        conn.helloTimer = setTimeout(() => {
            conn.helloTimer = null;
            if (!conn.authenticated)
                ws.close();
        }, HELLO_TIMEOUT);
        this.connections.set(connId, conn);
        return connId;
    }
    /** Check the access proof in a hello frame and admit the connection. */
    handleHello(conn, token, auth) {
        if (typeof token !== "string" || !TOKEN_RE.test(token) ||
            typeof auth !== "string" || !HEX64_RE.test(auth)) {
            conn.ws.close();
            return;
        }
        const presented = sha256Hex(auth);
        if (this.verifier === null) {
            this.verifier = presented;
        }
        else if (!(0, crypto_1.timingSafeEqual)(Buffer.from(presented, "hex"), Buffer.from(this.verifier, "hex"))) {
            this.send(conn, JSON.stringify({ type: "error", code: "AUTH_FAILED" }));
            conn.ws.close();
            return;
        }
        if (conn.helloTimer) {
            clearTimeout(conn.helloTimer);
            conn.helloTimer = null;
        }
        conn.authenticated = true;
        conn.token = token;
        this.pruneExpired();
        // If others are now here, start burn timers on all unread messages
        if (this.memberCount() > 1) {
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
    }
    /**
     * Cover traffic: produce exactly the frames an accepted message would
     * (message to every member including the sender, confirmed to the sender,
     * then burn and deleted when others are present) without storing anything
     * or touching TTL, dead-drop, or rate-limit state.
     */
    relayCover(conn, payload) {
        const now = Date.now();
        const id = (0, crypto_1.randomUUID)();
        const ttl = this.hasHadReply ? ACTIVE_TTL : DEAD_DROP_TTL;
        this.broadcast(JSON.stringify({ type: "message", payload, id, ts: now, expiresAt: now + ttl }));
        this.send(conn, JSON.stringify({ type: "confirmed", id }));
        if (this.memberCount() > 1 && this.coverTimers.size < MAX_COVER_TIMERS) {
            this.broadcast(JSON.stringify({ type: "burn", id, burnAt: Date.now() + BURN_TTL }));
            const timer = setTimeout(() => {
                this.coverTimers.delete(timer);
                this.broadcast(JSON.stringify({ type: "deleted", ids: [id] }));
            }, BURN_TTL);
            this.coverTimers.add(timer);
        }
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
        if (!parsed || typeof parsed !== "object")
            return;
        // Until a connection proves knowledge of the room secret, only hello counts
        if (!conn.authenticated) {
            if (parsed.type === "hello")
                this.handleHello(conn, parsed.token, parsed.auth);
            return;
        }
        const senderToken = conn.token;
        if (parsed.type === "acknowledge") {
            const ids = parsed.ids;
            if (!Array.isArray(ids) || ids.length > MAX_ACK_IDS ||
                !ids.every((i) => typeof i === "string" && i.length <= 64)) {
                return;
            }
            for (const msg of this.messages) {
                if (ids.includes(msg.id) && msg.readAt === null && msg.senderId !== senderToken) {
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
        if (parsed.type !== "message" || typeof parsed.payload !== "string" || !parsed.payload)
            return;
        if (parsed.payload.length > MAX_PAYLOAD_SIZE)
            return;
        if (parsed.c === 1) {
            this.relayCover(conn, parsed.payload);
            return;
        }
        if (parsed.c !== 0)
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
        if (this.memberCount() > 1) {
            this.startBurnTimer(storedMsg);
        }
        this.persist();
    }
    onClose(connId) {
        const conn = this.connections.get(connId);
        if (conn?.helloTimer)
            clearTimeout(conn.helloTimer);
        this.rateLimits.delete(connId);
        this.connections.delete(connId);
        if (conn?.authenticated)
            this.broadcastPresence();
        this.startIdleTimer();
    }
}
exports.ChatRoom = ChatRoom;
