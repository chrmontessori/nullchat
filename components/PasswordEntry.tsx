"use client";

import { useState } from "react";
import Link from "next/link";
import EntropyHint from "./EntropyHint";

interface Props {
  onSubmit: (password: string) => void;
  loading: boolean;
}

export default function PasswordEntry({ onSubmit, loading }: Props) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setPassword("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: "40px 24px",
        paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))",
        background: "#000",
      }}
    >
      <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
        {/* Title */}
        <h1
          style={{
            fontSize: 34,
            fontWeight: 300,
            letterSpacing: "0.25em",
            color: "#fff",
            marginBottom: 8,
          }}
        >
          nullchat
        </h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 48 }}>
          encrypted &middot; anonymous &middot; ephemeral
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} method="POST">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(e); } }}
            placeholder="Enter shared secret"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            disabled={loading}
            style={{
              width: "100%",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #333",
              padding: "12px 0",
              fontSize: 16,
              color: "#fff",
              textAlign: "center",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderBottomColor = "#3478f6")}
            onBlur={(e) => (e.target.style.borderBottomColor = "#333")}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 12,
              minHeight: 20,
            }}
          >
            <EntropyHint password={password} />
            {loading && (
              <span style={{ fontSize: 13, color: "#666" }}>
                Deriving key...
              </span>
            )}
          </div>
        </form>

        <p style={{ fontSize: 13, color: "#444", marginTop: 12 }}>
          Press{" "}
          <span
            style={{
              display: "inline-block",
              border: "1px solid #333",
              borderRadius: 4,
              padding: "1px 8px",
              fontSize: 12,
              color: "#666",
            }}
          >
            return
          </span>
          {" "}to enter
        </p>

        {/* Footer */}
        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "#333" }}>
            End-to-end encrypted. No accounts. No logs.
          </p>
          <Link
            href="/faq"
            style={{
              display: "inline-block",
              marginTop: 20,
              fontSize: 13,
              color: "#3478f6",
              textDecoration: "none",
            }}
          >
            How it works &rarr;
          </Link>
          <p style={{ fontSize: 11, color: "#333", marginTop: 24 }}>
            Powered by{" "}
            <a
              href="https://artorias.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#333", textDecoration: "underline" }}
            >
              Artorias
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
