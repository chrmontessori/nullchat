"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
const path_1 = require("path");
const ws_1 = require("ws");
const room_1 = require("./room");
const PORT = parseInt(process.env.PORT || "3000", 10);
const STATIC_DIR = (0, path_1.join)(__dirname, "..", "..", "out");
const TOR_ONLY = process.env.TOR_ONLY === "1";
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
function buildCSP(host) {
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
function isTorConnection(req) {
    const host = (req.headers.host || "").toLowerCase();
    return host.endsWith(".onion") || host.includes(".onion:");
}
function serveStatic(req, res) {
    // Tor-only mode: reject non-.onion requests
    if (TOR_ONLY && !isTorConnection(req)) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("Forbidden: Tor access only");
        return;
    }
    setSecurityHeaders(req, res);
    let urlPath = req.url?.split("?")[0] || "/";
    if (urlPath.endsWith("/"))
        urlPath += "index.html";
    // Try exact file, then with .html, then directory/index.html
    const candidates = [
        (0, path_1.join)(STATIC_DIR, urlPath),
        (0, path_1.join)(STATIC_DIR, urlPath + ".html"),
        (0, path_1.join)(STATIC_DIR, urlPath, "index.html"),
    ];
    for (const filePath of candidates) {
        if ((0, fs_1.existsSync)(filePath) && (0, fs_1.statSync)(filePath).isFile()) {
            const ext = (0, path_1.extname)(filePath);
            const mime = MIME[ext] || "application/octet-stream";
            res.writeHead(200, { "Content-Type": mime });
            res.end((0, fs_1.readFileSync)(filePath));
            return;
        }
    }
    // SPA fallback — serve index.html for client-side routes
    const indexPath = (0, path_1.join)(STATIC_DIR, "index.html");
    if ((0, fs_1.existsSync)(indexPath)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end((0, fs_1.readFileSync)(indexPath));
        return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
}
// --- Room manager ---
const rooms = new Map();
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
const wss = new ws_1.WebSocketServer({ noServer: true, perMessageDeflate: false });
// Per-IP rate limiting for WebSocket upgrades (max 5 connections per minute)
const upgradeAttempts = new Map();
const WS_UPGRADE_LIMIT = 5;
const WS_UPGRADE_WINDOW = 60_000; // 1 minute
function isUpgradeRateLimited(req) {
    // Use a generic key since we don't log real IPs
    const key = req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim()
        || req.socket.remoteAddress
        || "unknown";
    const now = Date.now();
    const attempts = (upgradeAttempts.get(key) || []).filter((t) => now - t < WS_UPGRADE_WINDOW);
    if (attempts.length >= WS_UPGRADE_LIMIT)
        return true;
    attempts.push(now);
    upgradeAttempts.set(key, attempts);
    return false;
}
// Periodically clean up stale entries
setInterval(() => {
    const now = Date.now();
    for (const [key, attempts] of upgradeAttempts) {
        const valid = attempts.filter((t) => now - t < WS_UPGRADE_WINDOW);
        if (valid.length === 0)
            upgradeAttempts.delete(key);
        else
            upgradeAttempts.set(key, valid);
    }
}, 60_000);
httpServer.on("upgrade", (req, socket, head) => {
    // Rate limit WebSocket upgrades to prevent connection flooding
    if (isUpgradeRateLimited(req)) {
        socket.destroy();
        return;
    }
    // Tor-only mode: reject non-.onion WebSocket upgrades
    if (TOR_ONLY && !isTorConnection(req)) {
        socket.destroy();
        return;
    }
    const url = req.url || "";
    const match = url.match(/^\/ws\/([a-zA-Z0-9_-]+)/);
    if (!match) {
        socket.destroy();
        return;
    }
    const roomId = match[1];
    // Proof of Tor: reject clearnet connections to Tor-only rooms
    if (roomId.startsWith("tor-") && !isTorConnection(req)) {
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
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
        ws.on("message", (data, isBinary) => {
            // Accept both binary and text frames for compatibility
            const str = isBinary
                ? Buffer.isBuffer(data)
                    ? data.toString("utf-8")
                    : Buffer.from(data).toString("utf-8")
                : data.toString();
            room.onMessage(str, connId);
        });
        ws.on("close", () => {
            clearTimeout(paddingTimer);
            room.onClose(connId);
        });
        ws.on("error", () => {
            clearTimeout(paddingTimer);
            room.onClose(connId);
        });
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
httpServer.listen(PORT, "127.0.0.1");
