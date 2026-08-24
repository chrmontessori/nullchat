import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { randomBytes } from "crypto";
import { join, extname } from "path";
import { WebSocketServer, WebSocket } from "ws";
import { ChatRoom } from "./room";
import { initStorage, purgeExpiredRooms } from "./persistence";

const PORT = parseInt(process.env.PORT || "3000", 10);
const STATIC_DIR = join(__dirname, "..", "..", "out");
const TOR_ONLY = process.env.TOR_ONLY === "1";

// MIME types for static serving
const MIME: Record<string, string> = {
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

const ONION_HOST =
  "5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion";

const STATIC_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), display-capture=(), browsing-topics=()",
  "X-DNS-Prefetch-Control": "off",
  "Onion-Location": `http://${ONION_HOST}`,
  "Alt-Svc": `h2="${ONION_HOST}:80"; ma=86400`,
};

// Only reflect a Host value into the CSP if it is a plain hostname or
// hostname:port. Anything else (stray characters that could break out of
// the connect-src directive) falls back to the known onion host.
function safeWsHost(rawHost: string): string {
  const host = rawHost.toLowerCase();
  return /^[a-z0-9.-]+(:\d+)?$/.test(host) ? host : ONION_HOST;
}

function buildCSP(rawHost: string): string {
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

function setSecurityHeaders(req: IncomingMessage, res: ServerResponse) {
  const host = req.headers.host || "localhost";
  res.setHeader("Content-Security-Policy", buildCSP(host));
  for (const [key, value] of Object.entries(STATIC_HEADERS)) {
    res.setHeader(key, value);
  }
}

// Treat a request as arriving over Tor only when its Host matches this
// service's exact onion address, not any string ending in ".onion". This
// closes the trivial forgery where a client sends "Host: anything.onion"
// to reach a tor- room. Note: true network-level Tor-only isolation should
// run the onion service on a dedicated instance with TOR_ONLY=1, since the
// Host header is the only signal available at the application layer.
function isTorConnection(req: IncomingMessage): boolean {
  const host = (req.headers.host || "").toLowerCase().split(":")[0];
  return host === ONION_HOST;
}

function serveStatic(req: IncomingMessage, res: ServerResponse) {
  // Tor-only mode: reject non-.onion requests
  if (TOR_ONLY && !isTorConnection(req)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden: Tor access only");
    return;
  }

  setSecurityHeaders(req, res);

  let urlPath = req.url?.split("?")[0] || "/";
  if (urlPath.endsWith("/")) urlPath += "index.html";

  // Try exact file, then with .html, then directory/index.html
  const candidates = [
    join(STATIC_DIR, urlPath),
    join(STATIC_DIR, urlPath + ".html"),
    join(STATIC_DIR, urlPath, "index.html"),
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = extname(filePath);
      const mime = MIME[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(readFileSync(filePath));
      return;
    }
  }

  // SPA fallback — serve index.html for client-side routes
  const indexPath = join(STATIC_DIR, "index.html");
  if (existsSync(indexPath)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(readFileSync(indexPath));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}

// --- Room manager ---
const rooms = new Map<string, ChatRoom>();

function getOrCreateRoom(roomId: string): ChatRoom {
  let room = rooms.get(roomId);
  if (!room) {
    room = new ChatRoom(roomId, (id) => rooms.delete(id));
    rooms.set(roomId, room);
  }
  return room;
}

// --- HTTP + WebSocket server ---
const httpServer = createServer(serveStatic);

const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false });

// Per-IP rate limiting for WebSocket upgrades (max 5 connections per minute)
const upgradeAttempts = new Map<string, number[]>();
const WS_UPGRADE_LIMIT = 5;
const WS_UPGRADE_WINDOW = 60_000; // 1 minute

// Identify the client for rate limiting without trusting attacker-supplied
// headers. A client can prepend its own X-Forwarded-For, so the leftmost
// value is spoofable and lets an attacker rotate the key to bypass the cap.
// Prefer X-Real-IP (set by the reverse proxy), then the rightmost XFF entry
// (the one the proxy appended), then the socket address.
function clientKey(req: IncomingMessage): string {
  const realIp = req.headers["x-real-ip"]?.toString().trim();
  if (realIp) return realIp;
  const fwd = req.headers["x-forwarded-for"]?.toString();
  if (fwd) {
    const parts = fwd.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return req.socket.remoteAddress || "unknown";
}

function isUpgradeRateLimited(req: IncomingMessage): boolean {
  const key = clientKey(req);
  const now = Date.now();
  const attempts = (upgradeAttempts.get(key) || []).filter((t) => now - t < WS_UPGRADE_WINDOW);
  if (attempts.length >= WS_UPGRADE_LIMIT) return true;
  attempts.push(now);
  upgradeAttempts.set(key, attempts);
  return false;
}

// Periodically clean up stale entries
setInterval(() => {
  const now = Date.now();
  for (const [key, attempts] of upgradeAttempts) {
    const valid = attempts.filter((t) => now - t < WS_UPGRADE_WINDOW);
    if (valid.length === 0) upgradeAttempts.delete(key);
    else upgradeAttempts.set(key, valid);
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
        if (ws.readyState === WebSocket.OPEN) {
          // Random-length padding: 64–512 bytes of random data
          const len = 64 + Math.floor(Math.random() * 449);
          ws.send(randomBytes(len));
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
          : Buffer.from(data as ArrayBuffer).toString("utf-8")
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
    if (ws.readyState === WebSocket.OPEN) ws.ping();
  });
}, 60_000);

httpServer.on("close", () => clearInterval(pingInterval));

// Initialize persistent storage (restricted directory)
initStorage();

// Purge expired room files every 10 minutes
setInterval(purgeExpiredRooms, 10 * 60 * 1000);

httpServer.listen(PORT, "127.0.0.1");
