"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import PasswordEntry from "@/components/PasswordEntry";
import ChatRoom from "@/components/ChatRoom";
import { deriveRoomId } from "@/lib/room";
import { deriveKey } from "@/lib/crypto";

function ConnectingScreen({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onReady, 2000);
    return () => clearTimeout(timer);
  }, [onReady]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        background: "#000",
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <p
        style={{
          fontSize: 13,
          fontWeight: 300,
          letterSpacing: "0.1em",
          color: "#555",
        }}
      >
        Establishing secure connection...
      </p>
      <div
        style={{
          width: 260,
          height: 1,
          background: "#222",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#3478f6",
            borderRadius: 1,
            animation: "loadbar 2s ease-in-out forwards",
          }}
        />
      </div>
      </div>
      <style>{`
        @keyframes loadbar {
          0% { width: 0%; }
          20% { width: 15%; }
          50% { width: 55%; }
          80% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState<"entry" | "connecting" | "chat">("entry");
  const [loading, setLoading] = useState(false);
  const roomIdRef = useRef("");
  const keyRef = useRef<Uint8Array | null>(null);
  const torIsolatedRef = useRef(false);
  const [, setTick] = useState(0);

  const handleSubmit = async (password: string, torIsolated: boolean) => {
    if (loading) return;
    setLoading(true);
    try {
      const [id, key] = await Promise.all([
        deriveRoomId(password),
        deriveKey(password),
      ]);
      // Tor-isolated rooms use a separate namespace so only other
      // Tor users with the toggle enabled land in the same room
      roomIdRef.current = torIsolated ? `tor-${id}` : id;
      torIsolatedRef.current = torIsolated;
      keyRef.current = key;
      setPhase("connecting");
    } catch (err) {
      console.error("Key derivation failed:", err);
      setLoading(false);
    }
  };

  const handleConnectingDone = useCallback(() => {
    setPhase("chat");
    setTick((t) => t + 1);
  }, []);

  const handleLeave = useCallback(() => {
    roomIdRef.current = "";
    keyRef.current = null;
    setPhase("entry");
    setLoading(false);
  }, []);

  if (phase === "connecting") {
    return <ConnectingScreen onReady={handleConnectingDone} />;
  }

  if (phase === "chat" && keyRef.current) {
    return (
      <ChatRoom
        roomId={roomIdRef.current}
        encryptionKey={keyRef.current}
        torIsolated={torIsolatedRef.current}
        onLeave={handleLeave}
      />
    );
  }

  return <PasswordEntry onSubmit={handleSubmit} loading={loading} />;
}
