"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  encrypt,
  openEnvelope,
  createEnvelope,
  generateAlias,
} from "@/lib/crypto";
import type { ClientEvent, ServerEvent } from "@/lib/protocol";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

const WS_MODE = process.env.NEXT_PUBLIC_WS_MODE || "partykit";

// Delay before reconnecting after the socket closes
const RECONNECT_DELAY_MS = 1500;

// Cover messages go out at random intervals of 10 to 60 seconds.
const COVER_MIN_MS = 10000;
const COVER_SPREAD_MS = 50000;

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
    // Tor: connect to same origin via standalone server
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return new WebSocket(`${proto}//${window.location.host}/ws/${roomId}`);
  }
  // Clearnet: connect to shared WebSocket server
  const wsHost = process.env.NEXT_PUBLIC_WS_HOST || "ws.nullchat.org";
  return new WebSocket(`wss://${wsHost}/ws/${roomId}`);
}

/** Send JSON as a binary WebSocket frame (ArrayBuffer) */
function wsSendJSON(ws: WebSocket, obj: ClientEvent) {
  ws.send(new TextEncoder().encode(JSON.stringify(obj)));
}

interface Props {
  roomId: string;
  encryptionKey: Uint8Array;
  auth: string; // room auth value sent in the hello frame
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

function DeadDropTimer({ expiresAt, color, expiresLabel }: { expiresAt: number; color?: string; expiresLabel?: string }) {
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
      title={expiresLabel}
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

export default function ChatRoom({ roomId, encryptionKey, auth, torIsolated, onLeave }: Props) {
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [othersHere, setOthersHere] = useState(false);
  // true once the server has accepted auth and sent history
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<TranslationKey | null>(null);
  const [showTerminate, setShowTerminate] = useState(false);
  const [deadDropAcked, setDeadDropAcked] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const aliasRef = useRef(generateAlias());
  const sessionTokenRef = useRef(generateUUID());
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Server message ids already shown
  const seenRef = useRef(new Set<string>());
  // Envelope ids received this session; kept across reconnects
  const seenEnvelopeIdsRef = useRef(new Set<string>());
  // Envelope ids of messages this client sent; decides `mine`
  const sentEnvelopeIdsRef = useRef(new Set<string>());
  // Set on leave, terminate, panic, inactivity timeout and AUTH_FAILED;
  // once set, the socket is never reopened
  const stoppedRef = useRef(false);
  // Mirrors `messages` synchronously so socket handlers can check which
  // ids the client holds
  const messagesRef = useRef<ChatMessage[]>([]);
  const keyRef = useRef(encryptionKey);
  keyRef.current = encryptionKey;

  const updateMessages = useCallback((fn: (prev: ChatMessage[]) => ChatMessage[]) => {
    const next = fn(messagesRef.current);
    if (next === messagesRef.current) return;
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const [stegoMode, setStegoMode] = useState(false);
  const [stegoDocName, setStegoDocName] = useState(() => {
    const d = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${months[d.getMonth()]} ${d.getDate()} Notes`;
  });
  const stegoInputMounted = useRef(false);
  const [darkMode, setDarkMode] = useState(true);
  const theme = darkMode ? darkTheme : lightTheme;
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
      stoppedRef.current = true;
      wsRef.current?.close();
      keyRef.current.fill(0);
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
      stoppedRef.current = true;
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
      updateMessages((prev) => {
        const now = Date.now();
        const filtered = prev.filter((m) => m.burnAt === null || m.burnAt > now);
        return filtered.length === prev.length ? prev : filtered;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [updateMessages]);

  // Sync browser tab title with stego document name
  useEffect(() => {
    if (stegoMode) {
      document.title = `${stegoDocName || "Untitled document"} - Google Docs`;
      return () => { document.title = "nullchat"; };
    }
  }, [stegoMode, stegoDocName]);

  // Handle mobile viewport resize when keyboard opens/closes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(scrollDown, 300);
    };
    window.visualViewport?.addEventListener("resize", handleResize);
    return () => window.visualViewport?.removeEventListener("resize", handleResize);
  }, [scrollDown]);

  useEffect(() => {
    const key = keyRef.current;
    const seenServerIds = seenRef.current;
    const seenEnvelopeIds = seenEnvelopeIdsRef.current;
    const sentEnvelopeIds = sentEnvelopeIdsRef.current;
    let disposed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let coverTimer: ReturnType<typeof setTimeout> | null = null;

    const mayConnect = () => !disposed && !stoppedRef.current;

    const clearCover = () => {
      if (coverTimer) clearTimeout(coverTimer);
      coverTimer = null;
    };

    const clearReconnect = () => {
      if (reconnectTimer) clearTimeout(reconnectTimer);
      reconnectTimer = null;
    };

    function scheduleReconnect() {
      if (!mayConnect() || reconnectTimer) return;
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, RECONNECT_DELAY_MS);
    }

    // Decrypt and validate one server message. Returns null for server
    // ids already shown and for envelopes openEnvelope rejects (cover
    // traffic, wrong version, repeated envelope id, stale or future ts,
    // or a payload that does not decrypt).
    function accept(
      id: unknown,
      payload: unknown,
      burnAt: number | null,
      expiresAt: number
    ): ChatMessage | null {
      if (typeof id !== "string" || typeof payload !== "string") return null;
      if (seenServerIds.has(id)) return null;
      const env = openEnvelope(payload, key, seenEnvelopeIds);
      if (!env) return null;
      seenServerIds.add(id);
      return {
        id,
        alias: env.alias,
        text: env.text,
        ts: env.ts,
        mine: sentEnvelopeIds.has(env.id),
        burnAt,
        expiresAt,
      };
    }

    function scheduleCover(ws: WebSocket) {
      clearCover();
      const delay = COVER_MIN_MS + Math.floor(Math.random() * COVER_SPREAD_MS);
      coverTimer = setTimeout(() => {
        coverTimer = null;
        if (wsRef.current !== ws || ws.readyState !== WebSocket.OPEN) return;
        // Same envelope shape, encryption and fixed padding as a real
        // message; receivers drop it after decryption because nop is set
        const envelope = createEnvelope(aliasRef.current, "", { nop: true });
        wsSendJSON(ws, { type: "message", payload: encrypt(envelope, key), c: 1 });
        scheduleCover(ws);
      }, delay);
    }

    function handleFrame(ws: WebSocket, data: ServerEvent) {
      switch (data.type) {
        case "history": {
          // Sent only after the server accepts auth
          const incoming: ChatMessage[] = [];
          for (const msg of Array.isArray(data.messages) ? data.messages : []) {
            const m = accept(msg.id, msg.payload, msg.burnAt ?? null, msg.expiresAt);
            if (m) incoming.push(m);
          }
          if (incoming.length) updateMessages((prev) => [...prev, ...incoming]);
          setHistoryLoaded(true);
          setConnected(true);
          setError(null);
          scheduleCover(ws);
          break;
        }
        case "message": {
          const m = accept(data.id, data.payload, null, data.expiresAt);
          if (m) updateMessages((prev) => [...prev, m]);
          break;
        }
        case "presence":
          setOthersHere(Boolean(data.othersHere));
          break;
        case "burn": {
          // Only a burn for a message this client holds changes state
          if (!messagesRef.current.some((m) => m.id === data.id)) break;
          setDeadDropAcked(true);
          updateMessages((prev) =>
            prev.map((m) => (m.id === data.id ? { ...m, burnAt: data.burnAt } : m))
          );
          break;
        }
        case "deleted": {
          if (!Array.isArray(data.ids)) break;
          const ids = new Set(data.ids);
          if (!messagesRef.current.some((m) => ids.has(m.id))) break;
          updateMessages((prev) => prev.filter((m) => !ids.has(m.id)));
          break;
        }
        case "confirmed":
          // No client state depends on delivery confirmation
          break;
        case "error":
          if (data.code === "AUTH_FAILED") {
            // The room is bound to a different secret: stop for good
            stoppedRef.current = true;
            clearReconnect();
            clearCover();
            setConnected(false);
            ws.close();
            keyRef.current.fill(0);
            onLeave();
          } else if (data.code === "RATE_LIMITED") {
            setError("slow_down");
            setTimeout(() => setError(null), 2000);
          } else if (data.code === "ROOM_FULL") {
            setError("room_full");
          }
          break;
      }
    }

    function connect() {
      if (!mayConnect()) return;
      let ws: WebSocket;
      try {
        ws = createSocket(roomId);
      } catch {
        scheduleReconnect();
        return;
      }
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.addEventListener("open", () => {
        if (wsRef.current !== ws) return;
        // First frame: session token plus room auth value
        wsSendJSON(ws, { type: "hello", token: sessionTokenRef.current, auth });
      });

      ws.addEventListener("close", () => {
        // A socket that has been replaced by a newer one leaves state alone
        if (wsRef.current !== ws) return;
        clearCover();
        setConnected(false);
        scheduleReconnect();
      });

      ws.addEventListener("message", (event: MessageEvent) => {
        if (wsRef.current !== ws) return;
        const raw = event.data;
        const str = raw instanceof ArrayBuffer
          ? new TextDecoder().decode(raw)
          : typeof raw === "string" ? raw : null;
        if (!str) return;
        let data: ServerEvent;
        try { data = JSON.parse(str); } catch { return; }
        if (!data || typeof data !== "object") return;
        handleFrame(ws, data);
      });
    }

    // Reconnect immediately when the tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState !== "visible" || !mayConnect()) return;
      const ws = wsRef.current;
      if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        clearReconnect();
        connect();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    connect();

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      clearReconnect();
      clearCover();
      wsRef.current?.close();
      seenServerIds.clear();
      seenEnvelopeIds.clear();
      sentEnvelopeIds.clear();
    };
  }, [roomId, auth, updateMessages]);

  const send = () => {
    const text = input.trim();
    if (!text || text.length > MAX_MESSAGE_LENGTH) return;
    // Keep the text in the input until the server has accepted auth
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || !connected) return;
    const envelope = createEnvelope(aliasRef.current, text);
    let payload: string;
    try {
      payload = encrypt(envelope, keyRef.current);
    } catch {
      // The 16 KiB fixed frame holds any 4096-char message of normal
      // text; this only fires on pathological input (thousands of
      // control chars that JSON-escape to 6 bytes each). Keep the input
      // intact and show the rate-limit style notice rather than throwing
      // out of the event handler and dropping the message silently.
      setError("slow_down");
      setTimeout(() => setError(null), 2000);
      return;
    }
    sentEnvelopeIdsRef.current.add(envelope.id);
    wsSendJSON(ws, { type: "message", payload, c: 0 });
    setInput("");
    setDeadDropAcked(true);
  };

  const acknowledge = (ids: string[]) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN || ids.length === 0) return;
    wsSendJSON(ws, { type: "acknowledge", ids });
    setDeadDropAcked(true);
  };

  // Zero-fill encryption key to minimize time it remains in memory
  const wipeKey = () => { keyRef.current.fill(0); };

  const leave = () => {
    stoppedRef.current = true;
    wsRef.current?.close();
    wipeKey();
    onLeave();
  };

  const terminate = () => {
    stoppedRef.current = true;
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) wsSendJSON(ws, { type: "terminate" });
    setShowTerminate(false);
    wipeKey();
    onLeave();
  };

  // Received button: only when alone picking up a dead drop (not already acked)
  const unreadFromOthers = deadDropAcked || othersHere ? [] : messages.filter((m) => !m.mine && m.burnAt === null);

  // --- Steganographic mode: disguise as Google Docs ---
  if (stegoMode) {
    const menuItems = ["File", "Edit", "View", "Insert", "Format", "Tools", "Extensions", "Help"];

    return (
      <div
        style={{
          display: "flex", flexDirection: "column", height: "100dvh",
          background: "#f9fbfd", position: "fixed" as const,
          top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden",
          fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        }}
      >
        {/* Title bar */}
        <div style={{ display: "flex", alignItems: "center", padding: "6px 16px 0", background: "#fff", flexShrink: 0 }}>
          <svg width="24" height="30" viewBox="0 0 24 30" style={{ marginRight: 6, flexShrink: 0 }}>
            <rect x="2" y="2" width="20" height="26" rx="2" fill="#4285f4" />
            <rect x="7" y="8" width="10" height="1.5" rx="0.75" fill="#fff" />
            <rect x="7" y="12" width="10" height="1.5" rx="0.75" fill="#fff" />
            <rect x="7" y="16" width="7" height="1.5" rx="0.75" fill="#fff" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              type="text"
              value={stegoDocName}
              onChange={(e) => setStegoDocName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
              style={{
                fontSize: 18, fontWeight: 400, color: "#202124", lineHeight: 1.4,
                background: "transparent", border: "none", outline: "none",
                width: "100%", padding: "2px 4px", fontFamily: "inherit",
                borderRadius: 4,
              }}
              onFocus={(e) => { e.currentTarget.style.border = "2px solid #c2e0ff"; e.currentTarget.style.padding = "0 2px"; }}
              onBlur={(e) => { e.currentTarget.style.border = "none"; e.currentTarget.style.padding = "2px 4px"; }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: -2, marginLeft: -4 }}>
              {menuItems.map((item) => (
                <span key={item} style={{
                  fontSize: 14, color: "#444746", padding: "4px 8px",
                  borderRadius: 4, cursor: "default", lineHeight: 1,
                }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button style={{
              background: "#c2e7ff", border: "none", borderRadius: 20,
              padding: "8px 20px", fontSize: 14, fontWeight: 500,
              color: "#001d35", cursor: "default", display: "flex",
              alignItems: "center", gap: 6, lineHeight: 1,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#001d35" strokeWidth="2.5"><path d="M16 3h5v5M21 3l-9 9M10 5H5a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" /></svg>
              Share
            </button>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: "#1a73e8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
                {aliasRef.current.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{
          display: "flex", alignItems: "center", padding: "6px 12px",
          background: "#edf2fa", flexShrink: 0, gap: 6,
          margin: "0 4px", borderRadius: 24, overflow: "hidden",
        }}>
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>↩</span>
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>↪</span>
          <div style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px" }} />
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>100%</span>
          <div style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px" }} />
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>Normal text</span>
          <div style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px" }} />
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>Arial</span>
          <div style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px" }} />
          <span style={{ fontSize: 13, color: "#444746", padding: "4px 8px", cursor: "default" }}>11</span>
          <div style={{ width: 1, height: 20, background: "#c4c7c5", margin: "0 2px" }} />
          <span style={{ fontSize: 14, color: "#444746", padding: "4px 6px", cursor: "default", fontWeight: 700 }}>B</span>
          <span style={{ fontSize: 14, color: "#444746", padding: "4px 6px", cursor: "default", fontStyle: "italic" }}>I</span>
          <span style={{ fontSize: 14, color: "#444746", padding: "4px 6px", cursor: "default", textDecoration: "underline" }}>U</span>
          <span style={{ fontSize: 14, color: "#444746", padding: "4px 6px", cursor: "default" }}>A</span>
        </div>

        {/* Document body */}
        <div style={{ flex: 1, overflowY: "auto", background: "#f9fbfd", padding: "20px 0" }}>
          <div
            onCopy={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              maxWidth: 816, minHeight: 1056, margin: "0 auto",
              background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
              borderRadius: 2, padding: "72px 96px",
              userSelect: "none", WebkitUserSelect: "none",
            }}
          >
            {messages.length === 0 && historyLoaded && (
              <p style={{ fontSize: 15, color: "#80868b", fontFamily: "Arial, sans-serif" }}>Start typing...</p>
            )}
            {messages.map((msg) => (
              <p key={msg.id} style={{
                fontSize: 15, lineHeight: 1.75, color: "#202124",
                fontFamily: "Arial, sans-serif", marginBottom: 8,
                wordBreak: "break-word",
              }}>
                {msg.text}
              </p>
            ))}
            <div style={{ position: "relative" }}>
              <input
                ref={(el) => { if (el && !stegoInputMounted.current) { stegoInputMounted.current = true; el.focus(); } }}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder=""
                maxLength={MAX_MESSAGE_LENGTH}
                autoComplete="off"
                spellCheck={false}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  fontSize: 15, lineHeight: 1.75, color: "#202124",
                  fontFamily: "Arial, sans-serif", padding: 0,
                  outline: "none", caretColor: "#202124",
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
        background: theme.bg,
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
          borderBottom: `1px solid ${theme.headerBorder}`,
          background: theme.headerBg,
          flexShrink: 0,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 300, letterSpacing: "0.15em", color: theme.text, whiteSpace: "nowrap" }}>
            nullchat
          </span>
          <div style={{ width: 1, height: 16, background: theme.divider, flexShrink: 0 }} />
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
            <span style={{ fontSize: 13, color: theme.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {!connected ? t("connecting") : othersHere ? t("others_here") : t("waiting")}
            </span>
          </div>
          <div style={{ width: 1, height: 16, background: theme.divider, flexShrink: 0 }} />
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
            {torIsolated ? t("tor_only") : t("clearnet")}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: theme.accent,
              background: theme.aliasBg,
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
          <button onClick={leave} style={{ ...headerBtn, color: theme.textSecondary }}>{t("leave")}</button>
          <button onClick={() => setShowTerminate(true)} style={{ ...headerBtn, color: "#ff453a" }}>
            {t("terminate")}
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
            borderBottom: `1px solid ${theme.headerBorder}`,
            background: theme.headerBg,
            flexShrink: 0,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13, color: theme.textSecondary }}>
            {t("terminate_confirm")}
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowTerminate(false)} style={{ ...headerBtn, color: theme.textSecondary }}>{t("cancel")}</button>
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
              {t("confirm")}
            </button>
          </div>
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
            <p style={{ fontSize: 15, color: theme.textMuted }}>{t("e2e_encrypted")}</p>
            <p style={{ fontSize: 13, color: theme.textFaint }}>{t("messages_burn")}</p>
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
                  background: msg.mine ? theme.myBubble : theme.theirBubble,
                  color: msg.mine ? "#fff" : theme.text,
                }}
              >
                {!msg.mine && (
                  <div style={{ fontSize: 11, fontFamily: "monospace", color: theme.accent, marginBottom: 3 }}>
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
                      color: msg.mine ? theme.timeAgoMine : theme.timeAgoTheirs,
                    }}
                  >
                    {timeAgo(msg.ts)}
                  </span>
                  {msg.burnAt !== null ? (
                    <BurnTimer burnAt={msg.burnAt} color={theme.burnTimer} />
                  ) : !othersHere ? (
                    <DeadDropTimer expiresAt={msg.expiresAt} color={theme.deadDropTimer} expiresLabel={t("expires_unread")} />
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
            borderTop: `1px solid ${theme.headerBorder}`,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => acknowledge(unreadFromOthers.map((m) => m.id))}
            style={{
              fontSize: 13,
              color: "#30d158",
              background: "none",
              border: `1px solid ${theme.receivedBorder}`,
              borderRadius: 20,
              padding: "8px 24px",
              cursor: "pointer",
              minHeight: 36,
            }}
          >
            {t("received")}
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
            background: theme.warningBg,
            borderTop: `1px solid ${theme.warningBorder}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 13, color: theme.warningText }}>
            {t("inactive_warning")}
          </span>
          <button
            onClick={resetInactivityTimer}
            style={{
              fontSize: 13,
              color: theme.warningText,
              background: "none",
              border: `1px solid ${theme.warningBorder}`,
              borderRadius: 20,
              padding: "6px 16px",
              cursor: "pointer",
              minHeight: 32,
            }}
          >
            {t("stay")}
          </button>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div style={{ textAlign: "center", padding: "8px 16px", fontSize: 14, color: "#ff453a", flexShrink: 0 }}>
          {t(error)}
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
          background: theme.bg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 560,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: 24,
            background: theme.inputBg,
            padding: "0 16px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={t("message_placeholder")}
            maxLength={MAX_MESSAGE_LENGTH}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              fontSize: 16,
              color: theme.text,
              padding: "12px 0",
              minHeight: 44,
            }}
          />
          <button
            onClick={send}
            style={{
              background: "none",
              border: "none",
              color: input.trim() ? theme.accent : theme.textFaint,
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
            {t("send")}
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
