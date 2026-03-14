"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import PartySocket from "partysocket";
import {
  encrypt,
  decrypt,
  generateAlias,
  roundTimestamp,
  hashPayload,
  type MessageEnvelope,
} from "@/lib/crypto";
import type { ServerEvent } from "@/lib/protocol";

const WS_MODE = process.env.NEXT_PUBLIC_WS_MODE || "partykit";

function generateUUID(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createSocket(roomId: string): WebSocket {
  if (WS_MODE === "standalone") {
    // Tor: connect to same origin
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return new WebSocket(`${proto}//${window.location.host}/ws/${roomId}`);
  }
  // Clearnet: connect to shared WebSocket server
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || "ws.nullchat.org";
  return new WebSocket(`wss://${wsHost}/ws/${roomId}`);
}

/** Send JSON as a binary WebSocket frame (ArrayBuffer) */
function wsSendJSON(ws: WebSocket, obj: unknown) {
  ws.send(new TextEncoder().encode(JSON.stringify(obj)));
}

interface Props {
  roomId: string;
  encryptionKey: Uint8Array;
  torIsolated: boolean;
  onLeave: () => void;
}

interface ChatMessage {
  id: string;
  alias: string;
  text: string;
  ts: number;
  mine: boolean;
  burnAt: number | null; // null = unread, timestamp = burning
  expiresAt: number; // server-assigned expiry timestamp
}

const MAX_MESSAGE_LENGTH = 4096;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const INACTIVITY_WARNING = 13 * 60 * 1000; // warn at 13 minutes

interface Theme {
  bg: string;
  headerBg: string;
  headerBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textFaint: string;
  divider: string;
  inputBg: string;
  inputBorder: string;
  myBubble: string;
  theirBubble: string;
  accent: string;
  aliasBg: string;
  burnTimer: string;
  deadDropTimer: string;
  timeAgoMine: string;
  timeAgoTheirs: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  receivedBorder: string;
}

const darkTheme: Theme = {
  bg: "#000",
  headerBg: "#0a0a0a",
  headerBorder: "#222",
  text: "#fff",
  textSecondary: "#888",
  textMuted: "#555",
  textFaint: "#333",
  divider: "#333",
  inputBg: "#111",
  inputBorder: "#333",
  myBubble: "#1a3a5c",
  theirBubble: "#1a1a1a",
  accent: "#3478f6",
  aliasBg: "#111",
  burnTimer: "#666",
  deadDropTimer: "rgba(255,255,255,0.4)",
  timeAgoMine: "rgba(255,255,255,0.35)",
  timeAgoTheirs: "#444",
  warningBg: "#1a1a00",
  warningBorder: "#333300",
  warningText: "#ffcc00",
  receivedBorder: "#1a3a2a",
};

const lightTheme: Theme = {
  bg: "#fff",
  headerBg: "#f5f5f5",
  headerBorder: "#e0e0e0",
  text: "#111",
  textSecondary: "#666",
  textMuted: "#999",
  textFaint: "#ccc",
  divider: "#ddd",
  inputBg: "#f0f0f0",
  inputBorder: "#ddd",
  myBubble: "#0b57d0",
  theirBubble: "#e9e9eb",
  accent: "#0b57d0",
  aliasBg: "#e8e8e8",
  burnTimer: "#999",
  deadDropTimer: "rgba(0,0,0,0.4)",
  timeAgoMine: "rgba(255,255,255,0.5)",
  timeAgoTheirs: "#999",
  warningBg: "#fff8e1",
  warningBorder: "#ffe082",
  warningText: "#f57f17",
  receivedBorder: "#a5d6a7",
};

function BurnTimer({ burnAt, color }: { burnAt: number; color?: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, burnAt - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, burnAt - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [burnAt]);

  const totalSecs = Math.ceil(remaining / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const display = `${mins}:${secs.toString().padStart(2, "0")}`;
  const urgent = totalSecs <= 60;

  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: "monospace",
        color: urgent ? "#ff453a" : (color || "#666"),
        marginLeft: 8,
      }}
    >
      {display}
    </span>
  );
}

function DeadDropTimer({ expiresAt, color }: { expiresAt: number; color?: string }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, expiresAt - Date.now());
      setRemaining(left);
      if (left <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const totalSecs = Math.ceil(remaining / 1000);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);

  let display: string;
  if (hrs > 0) {
    display = `${hrs}h ${mins}m`;
  } else {
    const secs = totalSecs % 60;
    display = `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <span
      style={{
        fontSize: 11,
        fontFamily: "monospace",
        color: color || "rgba(255,255,255,0.4)",
        marginLeft: 8,
      }}
      title="Expires if unread"
    >
      {display}
    </span>
  );
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return "1d+";
}

export default function ChatRoom({ roomId, encryptionKey, torIsolated, onLeave }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [othersHere, setOthersHere] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerminate, setShowTerminate] = useState(false);
  const [deadDropAcked, setDeadDropAcked] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const aliasRef = useRef(generateAlias());
  const sessionTokenRef = useRef(generateUUID());
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seenRef = useRef(new Set<string>());
  const keyRef = useRef(encryptionKey);
  keyRef.current = encryptionKey;
  const chainRef = useRef<string | null>(null); // hash of last message payload
  const [chainBroken, setChainBroken] = useState(false);

  const [stegoMode, setStegoMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const t = darkMode ? darkTheme : lightTheme;
  const [inactivityWarning, setInactivityWarning] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setInactivityWarning(false);

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    warningTimerRef.current = setTimeout(() => {
      setInactivityWarning(true);
    }, INACTIVITY_WARNING);

    inactivityTimerRef.current = setTimeout(() => {
      wsRef.current?.close();
      onLeave();
    }, INACTIVITY_TIMEOUT);
  }, [onLeave]);

  // Start inactivity timer on mount, listen for user activity
  useEffect(() => {
    resetInactivityTimer();

    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const handler = () => resetInactivityTimer();
    for (const e of events) window.addEventListener(e, handler, { passive: true });

    return () => {
      for (const e of events) window.removeEventListener(e, handler);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  // Clipboard auto-clear: wipe clipboard 15s after copy and on tab close
  useEffect(() => {
    let clearTimer: ReturnType<typeof setTimeout> | null = null;
    const onCopy = () => {
      if (clearTimer) clearTimeout(clearTimer);
      clearTimer = setTimeout(() => {
        navigator.clipboard?.writeText("").catch(() => {});
      }, 15000);
    };
    const onUnload = () => {
      navigator.clipboard?.writeText("").catch(() => {});
    };
    document.addEventListener("copy", onCopy);
    window.addEventListener("beforeunload", onUnload);
    return () => {
      document.removeEventListener("copy", onCopy);
      window.removeEventListener("beforeunload", onUnload);
      if (clearTimer) clearTimeout(clearTimer);
    };
  }, []);

  // Panic key: triple-tap Escape to instantly wipe session and redirect
  useEffect(() => {
    let panicked = false;
    let escCount = 0;
    let escTimer: ReturnType<typeof setTimeout> | null = null;

    const doPanic = () => {
      panicked = true;
      // Terminate session server-side
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsSendJSON(wsRef.current, { type: "terminate" });
      }
      wsRef.current?.close();
      // Wipe encryption key from memory
      keyRef.current.fill(0);
      // Wipe DOM content
      document.body.innerHTML = "";
      document.title = "Google";
      // Clear all browser storage
      try { sessionStorage.clear(); } catch {}
      try { localStorage.clear(); } catch {}
      // Clear clipboard
      navigator.clipboard?.writeText("").catch(() => {});
      // Redirect — replace history so back button can't return
      window.location.replace("https://www.google.com");
    };

    const onPanic = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      escCount++;
      if (escTimer) clearTimeout(escTimer);
      if (escCount >= 3) { doPanic(); return; }
      escTimer = setTimeout(() => { escCount = 0; }, 800);
    };

    // If the browser restores the page from bfcache after a panic,
    // immediately redirect again so the chat is never visible.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && panicked) doPanic();
    };

    window.addEventListener("keydown", onPanic, { capture: true });
    window.addEventListener("pageshow", onPageShow);
    return () => {
      window.removeEventListener("keydown", onPanic, { capture: true });
      window.removeEventListener("pageshow", onPageShow);
      if (escTimer) clearTimeout(escTimer);
    };
  }, []);

  // Steganographic mode: 5x Shift to toggle
  useEffect(() => {
    let tapCount = 0;
    let tapTimer: ReturnType<typeof setTimeout> | null = null;
    const onStego = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      tapCount++;
      if (tapTimer) clearTimeout(tapTimer);
      if (tapCount >= 5) {
        tapCount = 0;
        setStegoMode((v) => !v);
        return;
      }
      tapTimer = setTimeout(() => { tapCount = 0; }, 1200);
    };
    window.addEventListener("keydown", onStego, { capture: true });
    return () => {
      window.removeEventListener("keydown", onStego, { capture: true });
      if (tapTimer) clearTimeout(tapTimer);
    };
  }, []);

  // Block common screenshot keyboard shortcuts
  useEffect(() => {
    const blockScreenshot = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === "PrintScreen") { e.preventDefault(); return; }
      // macOS: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) { e.preventDefault(); return; }
      // Windows: Win+Shift+S (Snipping Tool)
      if (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") { e.preventDefault(); return; }
    };
    window.addEventListener("keydown", blockScreenshot, { capture: true });
    return () => window.removeEventListener("keydown", blockScreenshot, { capture: true });
  }, []);

  const hasScrolled = useRef(false);
  const scrollDown = useCallback(() => {
    // Don't auto-scroll in stego mode — a document editor doesn't jump around
    if (stegoMode) return;
    if (!hasScrolled.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
      hasScrolled.current = true;
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [stegoMode]);

  useEffect(() => { scrollDown(); }, [messages, scrollDown]);

  // Client-side cleanup: remove messages whose burn timer has expired
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prev) => {
        const now = Date.now();
        const filtered = prev.filter((m) => m.burnAt === null || m.burnAt > now);
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle mobile viewport resize when keyboard opens/closes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(scrollDown, 300);
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, [scrollDown]);

  useEffect(() => {
    const alias = aliasRef.current;
    const key = keyRef.current;

    const ws = createSocket(roomId);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      wsSendJSON(ws, { type: "identify", token: sessionTokenRef.current });
      setConnected(true);
      setError(null);
    });
    ws.addEventListener("close", () => { setConnected(false); });

    ws.addEventListener("message", (event: MessageEvent | Event) => {
      let data: ServerEvent;
      if (!("data" in event)) return;
      const raw = event.data;
      // Decode binary frames (ArrayBuffer) or text
      const str = raw instanceof ArrayBuffer
        ? new TextDecoder().decode(raw)
        : typeof raw === "string" ? raw : null;
      if (!str) return;
      try { data = JSON.parse(str); } catch { return; }

      if (data.type === "presence") {
        setOthersHere(data.othersHere);
      } else if (data.type === "error") {
        if (data.code === "RATE_LIMITED") {
          setError("Slow down");
          setTimeout(() => setError(null), 2000);
        } else if (data.code === "ROOM_FULL") {
          setError("Room is full");
        }
      } else if (data.type === "deleted") {
        setMessages((prev) => prev.filter((m) => !data.ids.includes(m.id)));
      } else if (data.type === "burn") {
        setDeadDropAcked(true);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.id ? { ...m, burnAt: data.burnAt } : m
          )
        );
      } else if (data.type === "history") {
        const dec: ChatMessage[] = [];
        for (const msg of data.messages) {
          if (seenRef.current.has(msg.id)) continue;
          const env = decrypt(msg.payload, key);
          if (env) {
            seenRef.current.add(msg.id);
            dec.push({
              id: msg.id,
              alias: env.alias,
              text: env.text,
              ts: env.ts,
              mine: env.alias === alias,
              burnAt: msg.burnAt,
              expiresAt: msg.expiresAt,
            });
          }
        }
        // Build chain from history — set chainRef to hash of last message
        if (data.messages.length > 0) {
          const lastPayload = data.messages[data.messages.length - 1].payload;
          hashPayload(lastPayload).then((h) => { chainRef.current = h; });
        }
        if (dec.length) setMessages((prev) => [...prev, ...dec]);
        setHistoryLoaded(true);
      } else if (data.type === "message") {
        if (seenRef.current.has(data.id)) return;
        const env = decrypt(data.payload, key);
        if (env) {
          // Verify integrity chain: does this message's chain hash match our last?
          if (env.chain && chainRef.current && env.chain !== chainRef.current) {
            setChainBroken(true);
          }
          // Advance chain to this message's payload hash
          hashPayload(data.payload).then((h) => { chainRef.current = h; });
          seenRef.current.add(data.id);
          setMessages((prev) => [...prev, {
            id: data.id,
            alias: env.alias,
            text: env.text,
            ts: env.ts,
            mine: env.alias === alias,
            burnAt: null,
            expiresAt: data.expiresAt,
          }]);
        }
      }
    });

    // --- Decoy traffic ---
    // Send encrypted no-op messages at random intervals to mask
    // when real communication happens. Server relays but does not
    // store decoys, preserving dead-drop TTL and buffer integrity.
    // Recipients decrypt and discard via the nop flag.
    const scheduleDecoy = () => {
      const delay = 10000 + Math.floor(Math.random() * 50000); // 10–60s
      return setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          const decoy: MessageEnvelope = {
            alias: aliasRef.current,
            text: "",
            ts: roundTimestamp(Date.now()),
            nop: true,
          };
          const payload = encrypt(decoy, keyRef.current);
          wsSendJSON(ws, { type: "decoy", payload });
        }
        decoyTimer = scheduleDecoy();
      }, delay);
    };
    let decoyTimer = scheduleDecoy();

    return () => { clearTimeout(decoyTimer); ws.close(); seenRef.current.clear(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const send = () => {
    const text = input.trim();
    if (!text || !wsRef.current || text.length > MAX_MESSAGE_LENGTH) return;
    const envelope: MessageEnvelope = {
      alias: aliasRef.current,
      text,
      ts: roundTimestamp(Date.now()),
      ...(chainRef.current ? { chain: chainRef.current } : {}),
    };
    const payload = encrypt(envelope, encryptionKey);
    // Advance chain to include our own message
    hashPayload(payload).then((h) => { chainRef.current = h; });
    wsSendJSON(wsRef.current, { type: "message", payload });
    setInput("");
    setDeadDropAcked(true);
  };

  const acknowledge = (ids: string[]) => {
    if (!wsRef.current || ids.length === 0) return;
    wsSendJSON(wsRef.current, { type: "acknowledge", ids });
    setDeadDropAcked(true);
  };

  // Zero-fill encryption key to minimize time it remains in memory
  const wipeKey = () => { keyRef.current.fill(0); };

  const leave = () => { wsRef.current?.close(); wipeKey(); onLeave(); };

  const terminate = () => {
    if (wsRef.current) wsSendJSON(wsRef.current, { type: "terminate" });
    setShowTerminate(false);
    wipeKey();
    onLeave();
  };

  // Received button: only when alone picking up a dead drop (not already acked)
  const unreadFromOthers = deadDropAcked || othersHere ? [] : messages.filter((m) => !m.mine && m.burnAt === null);

  // --- Steganographic mode: disguise as Google Docs ---
  if (stegoMode) {
    const stegoMenuItems = ["File", "Edit", "View", "Insert", "Format", "Tools", "Extensions", "Help"];
    const stegoToolbar = ["↩", "↪", "🖨", "│", "100%", "│", "Normal text", "│", "Arial", "│", "11", "│", "B", "I", "U", "A"];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          background: "#f9fbfd",
          position: "fixed" as const,
          top: 0, left: 0, right: 0, bottom: 0,
          overflow: "hidden",
          fontFamily: "'Google Sans', Arial, sans-serif",
        }}
      >
        {/* Title bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "8px 12px 0", background: "#fff", flexShrink: 0 }}>
          <div style={{ width: 24, height: 32, marginRight: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 20, height: 26, background: "#4285f4", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 10, height: 1, background: "#fff", boxShadow: "0 4px 0 #fff, 0 8px 0 #fff, 0 12px 0 #fff" }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 400, color: "#202124", lineHeight: 1.2 }}>Untitled document</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 13, color: "#444746" }}>Editing</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a73e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
                {aliasRef.current.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Menu bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "2px 12px 2px 44px", background: "#fff", flexShrink: 0, gap: 2 }}>
          {stegoMenuItems.map((item) => (
            <span key={item} style={{ fontSize: 13, color: "#202124", padding: "4px 8px", borderRadius: 4, cursor: "default" }}>{item}</span>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", padding: "4px 12px 4px 44px", background: "#edf2fa", borderBottom: "1px solid #dadce0", flexShrink: 0, gap: 4, flexWrap: "nowrap", overflow: "hidden" }}>
          {stegoToolbar.map((item, i) => (
            item === "│" ? (
              <div key={i} style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px", flexShrink: 0 }} />
            ) : (
              <span key={i} style={{
                fontSize: ["B", "I", "U", "A"].includes(item) ? 14 : 12,
                fontWeight: item === "B" ? 700 : ["I"].includes(item) ? 400 : 400,
                fontStyle: item === "I" ? "italic" : "normal",
                textDecoration: item === "U" ? "underline" : "none",
                color: "#444746",
                padding: "4px 6px",
                borderRadius: 4,
                cursor: "default",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>{item}</span>
            )
          ))}
        </div>

        {/* Document body */}
        <div style={{ flex: 1, overflowY: "auto", background: "#f9fbfd", padding: "20px 0" }}>
          <div
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              maxWidth: 816,
              minHeight: 1056,
              margin: "0 auto",
              background: "#fff",
              boxShadow: "0 0 0 1px #dadce0",
              padding: "72px 96px",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          >
            {messages.length === 0 && historyLoaded && (
              <p style={{ fontSize: 15, color: "#80868b", fontFamily: "Arial, sans-serif" }}>Start typing...</p>
            )}
            {messages.map((msg) => (
              <p key={msg.id} style={{
                fontSize: 15,
                lineHeight: 1.75,
                color: "#202124",
                fontFamily: "Arial, sans-serif",
                marginBottom: 12,
                wordBreak: "break-word",
              }}>
                {msg.text}
              </p>
            ))}
            {/* Input disguised as cursor / active typing area */}
            <div style={{ position: "relative" }}>
              <input
                ref={(el) => { if (el) el.focus(); }}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder=""
                maxLength={MAX_MESSAGE_LENGTH}
                autoComplete="off"
                spellCheck={false}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#202124",
                  fontFamily: "Arial, sans-serif",
                  padding: 0,
                  outline: "none",
                  caretColor: "#202124",
                }}
              />
            </div>
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: t.bg,
        paddingTop: "env(safe-area-inset-top, 0px)",
        overflow: "hidden",
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderBottom: `1px solid ${t.headerBorder}`,
          background: t.headerBg,
          flexShrink: 0,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 300, letterSpacing: "0.15em", color: t.text, whiteSpace: "nowrap" }}>
            nullchat
          </span>
          <div style={{ width: 1, height: 16, background: t.divider, flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: connected ? "#30d158" : "#ff453a",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 13, color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {!connected ? "Connecting..." : othersHere ? "Others here" : "Waiting..."}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: t.divider, flexShrink: 0 }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.05em",
              color: torIsolated ? "#30d158" : "#ff453a",
              background: torIsolated ? "rgba(48,209,88,0.1)" : "rgba(255,69,58,0.1)",
              padding: "2px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
            }}
          >
            {torIsolated ? "TOR ONLY" : "CLEARNET"}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: t.accent,
              background: t.aliasBg,
              padding: "3px 8px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              minHeight: 36,
            }}
          >
            {aliasRef.current}
          </span>
          <button onClick={leave} style={{ ...headerBtn, color: t.textSecondary }}>Leave</button>
          <button onClick={() => setShowTerminate(true)} style={{ ...headerBtn, color: "#ff453a" }}>
            Terminate
          </button>
        </div>
      </div>

      {/* ── Terminate confirmation ── */}
      {showTerminate && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: `1px solid ${t.headerBorder}`,
            background: t.headerBg,
            flexShrink: 0,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: t.textSecondary }}>
            Delete all your messages and disconnect?
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowTerminate(false)} style={{ ...headerBtn, color: t.textSecondary }}>Cancel</button>
            <button
              onClick={terminate}
              style={{
                fontSize: 14,
                color: "#fff",
                background: "#ff453a",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                cursor: "pointer",
                minHeight: 36,
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ── Integrity warning ── */}
      {chainBroken && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px",
            background: darkMode ? "#1a0000" : "#fff0f0",
            borderBottom: `1px solid ${darkMode ? "#330000" : "#ffcccc"}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12, color: "#ff453a" }}>
            Message integrity break detected — a message may have been dropped or injected
          </span>
        </div>
      )}

      {/* ── Messages ── */}
      <div
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 16px",
          WebkitOverflowScrolling: "touch",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {messages.length === 0 && historyLoaded && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 8,
            }}
          >
            <p style={{ fontSize: 15, color: t.textMuted }}>End-to-end encrypted</p>
            <p style={{ fontSize: 13, color: t.textFaint }}>Messages burn 5 minutes after being received</p>
          </div>
        )}

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.mine ? "flex-end" : "flex-start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: 18,
                  borderBottomRightRadius: msg.mine ? 4 : 18,
                  borderBottomLeftRadius: msg.mine ? 18 : 4,
                  background: msg.mine ? t.myBubble : t.theirBubble,
                  color: msg.mine ? "#fff" : t.text,
                }}
              >
                {!msg.mine && (
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: t.accent, marginBottom: 3 }}>
                    {msg.alias}
                  </div>
                )}
                <div style={{ fontSize: 15, lineHeight: 1.5, wordBreak: "break-word" }}>
                  {msg.text}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: 4,
                    gap: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: msg.mine ? t.timeAgoMine : t.timeAgoTheirs,
                    }}
                  >
                    {timeAgo(msg.ts)}
                  </span>
                  {msg.burnAt !== null ? (
                    <BurnTimer burnAt={msg.burnAt} color={t.burnTimer} />
                  ) : !othersHere ? (
                    <DeadDropTimer expiresAt={msg.expiresAt} color={t.deadDropTimer} />
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      {/* ── Received bar ── */}
      {unreadFromOthers.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "8px 16px",
            borderTop: `1px solid ${t.headerBorder}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => acknowledge(unreadFromOthers.map((m) => m.id))}
            style={{
              fontSize: 13,
              color: "#30d158",
              background: "none",
              border: `1px solid ${t.receivedBorder}`,
              borderRadius: 20,
              padding: "8px 24px",
              cursor: "pointer",
              minHeight: 36,
            }}
          >
            Received
          </button>
        </div>
      )}

      {/* ── Inactivity warning ── */}
      {inactivityWarning && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "10px 16px",
            background: t.warningBg,
            borderTop: `1px solid ${t.warningBorder}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, color: t.warningText }}>
            Inactive — disconnecting soon
          </span>
          <button
            onClick={resetInactivityTimer}
            style={{
              fontSize: 13,
              color: t.warningText,
              background: "none",
              border: `1px solid ${t.warningBorder}`,
              borderRadius: 20,
              padding: "6px 16px",
              cursor: "pointer",
              minHeight: 32,
            }}
          >
            Stay
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ textAlign: "center", padding: "8px 16px", fontSize: 14, color: "#ff453a", flexShrink: 0 }}>
          {error}
        </div>
      )}

      {/* ── Input ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
          flexShrink: 0,
          background: t.bg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 560,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: 24,
            background: t.inputBg,
            padding: "0 16px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Message"
            maxLength={MAX_MESSAGE_LENGTH}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              fontSize: 16,
              color: t.text,
              padding: "12px 0",
              minHeight: 44,
            }}
          />
          <button
            onClick={send}
            style={{
              background: "none",
              border: "none",
              color: input.trim() ? t.accent : t.textFaint,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              padding: "8px 4px 8px 12px",
              minHeight: 44,
              minWidth: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const headerBtn: React.CSSProperties = {
  fontSize: 14,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: 6,
  minHeight: 36,
};
