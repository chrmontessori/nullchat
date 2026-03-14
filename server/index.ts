import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { join, extname } from "path";
import { WebSocketServer, WebSocket } from "ws";
import { ChatRoom } from "./room";

const PORT = parseInt(process.env.PORT || "3000", 10);
const STATIC_DIR = join(__dirname, "..", "..", "out");

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

const STATIC_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  "X-DNS-Prefetch-Control": "off",
};

function buildCSP(host: string): string {
  return [
    "default-src 'self'",
    `connect-src 'self' ws://${host} ws://localhost:* ws://127.0.0.1:*`,
    "script-src 'self' 'unsafe-inline'",
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

function serveStatic(req: IncomingMessage, res: ServerResponse) {
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

const wss = new WebSocketServer({ noServer: true });

httpServer.on("upgrade", (req, socket, head) => {
  const url = req.url || "";
  const match = url.match(/^\/ws\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    socket.destroy();
    return;
  }

  const roomId = match[1];
  wss.handleUpgrade(req, socket, head, (ws) => {
    const room = getOrCreateRoom(roomId);
    const connId = room.onConnect(ws);

    ws.on("message", (data) => {
      room.onMessage(data.toString(), connId);
    });

    ws.on("close", () => {
      room.onClose(connId);
    });

    ws.on("error", () => {
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

httpServer.listen(PORT, "127.0.0.1");
