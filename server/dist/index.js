"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const path_1 = require("path");
const ws_1 = require("ws");
const room_1 = require("./room");
const persistence_1 = require("./persistence");
const PORT = parseInt(process.env.PORT || "3000", 10);
const STATIC_DIR = (0, path_1.resolve)(__dirname, "..", "..", "out");
const TOR_ONLY = process.env.TOR_ONLY === "1";
// Global resource ceilings. Per-address limits for clearnet live in nginx and
// the onion service is protected by Tor's proof-of-work defenses; this process
// never learns client addresses, so it only bounds total load.
const MAX_TOTAL_CONNECTIONS = 5000;
const MAX_ROOMS = 20000;
const MAX_FRAME_BYTES = 64 * 1024;
// Room IDs are 32-byte Argon2id outputs in lowercase hex, optionally
// namespaced for Tor-isolated rooms.
const WS_PATH_RE = /^\/ws\/((?:tor-)?[0-9a-f]{64})$/;
// MIME types for static serving
const MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".txt": "text/plain; charset=utf-8",
};
const ONION_HOST = "5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion";
const STATIC_HEADERS = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), display-capture=(), browsing-topics=()",
    "X-DNS-Prefetch-Control": "off",
    "Onion-Location": `http://${ONION_HOST}`,
    "Alt-Svc": `h2="${ONION_HOST}:80"; ma=86400`,
};
// Only reflect a Host value into the CSP if it is a plain hostname or
// hostname:port. Anything else falls back to the known onion host.
function safeWsHost(rawHost) {
    const host = rawHost.toLowerCase();
    return /^[a-z0-9.-]+(:\d+)?$/.test(host) ? host : ONION_HOST;
}
function buildCSP(rawHost) {
    const host = safeWsHost(rawHost);
    return [
        "default-src 'self'",
        `connect-src 'self' ws://${host} ws://localhost:* ws://127.0.0.1:*`,
        "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self'",
        "font-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
    ].join("; ");
}
function setSecurityHeaders(req, res) {
    const host = req.headers.host || "localhost";
    res.setHeader("Content-Security-Policy", buildCSP(host));
    for (const [key, value] of Object.entries(STATIC_HEADERS)) {
        res.setHeader(key, value);
    }
}
// Treat a request as arriving over Tor only when its Host matches this
// service's exact onion address. nginx always forwards clearnet requests with
// a fixed Host of ws.nullchat.org, so clearnet traffic never matches.
function isTorConnection(req) {
    const host = (req.headers.host || "").toLowerCase().split(":")[0];
    return host === ONION_HOST;
}
function sendPlain(res, status, body, extra = {}) {
    res.writeHead(status, { "Content-Type": "text/plain", ...extra });
    res.end(body);
}
/** Resolve a request path to a file inside STATIC_DIR, or null if it falls outside. */
function resolveStatic(relPath) {
    const full = (0, path_1.resolve)(STATIC_DIR, "." + (relPath.startsWith("/") ? relPath : "/" + relPath));
    if (full !== STATIC_DIR && !full.startsWith(STATIC_DIR + path_1.sep))
        return null;
    return full;
}
function sendFile(req, res, filePath) {
    const mime = MIME[(0, path_1.extname)(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": mime });
    res.end(req.method === "HEAD" ? undefined : (0, fs_1.readFileSync)(filePath));
}
function serveStatic(req, res) {
    // Tor-only mode: reject non-.onion requests
    if (TOR_ONLY && !isTorConnection(req)) {
        sendPlain(res, 403, "Forbidden: Tor access only");
        return;
    }
    setSecurityHeaders(req, res);
    if (req.method !== "GET" && req.method !== "HEAD") {
        sendPlain(res, 405, "Method Not Allowed", { Allow: "GET, HEAD" });
        return;
    }
    let urlPath;
    try {
        urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    }
    catch {
        sendPlain(res, 400, "Bad Request");
        return;
    }
    if (urlPath.includes("\0")) {
        sendPlain(res, 400, "Bad Request");
        return;
    }
    if (urlPath.endsWith("/"))
        urlPath += "index.html";
    // Try exact file, then with .html, then directory/index.html. Every
    // candidate must resolve inside STATIC_DIR.
    const candidates = [urlPath, urlPath + ".html", urlPath + "/index.html"];
    for (const candidate of candidates) {
        const filePath = resolveStatic(candidate);
        if (filePath === null) {
            sendPlain(res, 404, "Not Found");
            return;
        }
        if ((0, fs_1.existsSync)(filePath) && (0, fs_1.statSync)(filePath).isFile()) {
            sendFile(req, res, filePath);
            return;
        }
    }
    // SPA fallback — serve index.html for client-side routes
    const indexPath = (0, path_1.resolve)(STATIC_DIR, "index.html");
    if ((0, fs_1.existsSync)(indexPath)) {
        sendFile(req, res, indexPath);
        return;
    }
    sendPlain(res, 404, "Not Found");
}
// --- Room manager ---
const rooms = new Map();
let totalConnections = 0;
function getOrCreateRoom(roomId) {
    let room = rooms.get(roomId);
    if (!room) {
        room = new room_1.ChatRoom(roomId, (id) => rooms.delete(id));
        rooms.set(roomId, room);
    }
    return room;
}
// --- HTTP + WebSocket server ---
const httpServer = (0, http_1.createServer)(serveStatic);
const wss = new ws_1.WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
    maxPayload: MAX_FRAME_BYTES,
});
httpServer.on("upgrade", (req, socket, head) => {
    // Tor-only mode: reject non-.onion WebSocket upgrades
    if (TOR_ONLY && !isTorConnection(req)) {
        socket.destroy();
        return;
    }
    const match = (req.url || "").split("?")[0].match(WS_PATH_RE);
    if (!match) {
        socket.destroy();
        return;
    }
    const roomId = match[1];
    // Tor-isolated rooms accept only connections arriving over the onion service
    if (roomId.startsWith("tor-") && !isTorConnection(req)) {
        socket.destroy();
        return;
    }
    // Global capacity ceilings
    if (totalConnections >= MAX_TOTAL_CONNECTIONS || (!rooms.has(roomId) && rooms.size >= MAX_ROOMS)) {
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
        totalConnections++;
        const room = getOrCreateRoom(roomId);
        const connId = room.onConnect(ws);
        // --- Connection padding ---
        // Send random-length dummy binary frames at random intervals
        // to defeat traffic analysis. Client ignores non-JSON binary data.
        const schedulePadding = () => {
            // Random interval: 5–30 seconds
            const delay = 5000 + Math.floor(Math.random() * 25000);
            return setTimeout(() => {
                if (ws.readyState === ws_1.WebSocket.OPEN) {
                    // Random-length padding: 64–512 bytes of random data
                    const len = 64 + Math.floor(Math.random() * 449);
                    ws.send((0, crypto_1.randomBytes)(len));
                }
                paddingTimer = schedulePadding();
            }, delay);
        };
        let paddingTimer = schedulePadding();
        let closed = false;
        const cleanup = () => {
            if (closed)
                return;
            closed = true;
            totalConnections--;
            clearTimeout(paddingTimer);
            room.onClose(connId);
        };
        ws.on("message", (data, isBinary) => {
            // Accept both binary and text frames for compatibility
            const str = isBinary
                ? Buffer.isBuffer(data)
                    ? data.toString("utf-8")
                    : Buffer.from(data).toString("utf-8")
                : data.toString();
            room.onMessage(str, connId);
        });
        ws.on("close", cleanup);
        ws.on("error", cleanup);
    });
});
// Tor-friendly: higher ping interval for high-latency circuits
const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.readyState === ws_1.WebSocket.OPEN)
            ws.ping();
    });
}, 60_000);
httpServer.on("close", () => clearInterval(pingInterval));
// Initialize persistent storage (restricted directory)
(0, persistence_1.initStorage)();
// Purge expired room files every 10 minutes
setInterval(persistence_1.purgeExpiredRooms, 10 * 60 * 1000);
httpServer.listen(PORT, "127.0.0.1");
