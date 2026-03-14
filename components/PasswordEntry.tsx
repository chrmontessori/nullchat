"use client";

import { useState } from "react";
import Link from "next/link";
import EntropyHint from "./EntropyHint";
import { useI18n, LANGUAGES } from "@/lib/i18n/context";

const IS_TOR = process.env.NEXT_PUBLIC_WS_MODE === "standalone";

interface Props {
  onSubmit: (password: string, torIsolated: boolean) => void;
  loading: boolean;
}

export default function PasswordEntry({ onSubmit, loading }: Props) {
  const [password, setPassword] = useState("");
  const [torIsolated, setTorIsolated] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const { t, lang, setLang } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = password.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed, torIsolated);
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
          {t("encrypted_anonymous_ephemeral")}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} method="POST">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(e); } }}
            placeholder={t("enter_shared_secret")}
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
                {t("deriving_key")}
              </span>
            )}
          </div>

          {IS_TOR && (
            <button
              type="button"
              onClick={() => setTorIsolated((v) => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                margin: "14px auto 0",
                padding: "6px 14px",
                background: "none",
                border: `1px solid ${torIsolated ? "#30d158" : "#333"}`,
                borderRadius: 20,
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 18,
                  borderRadius: 9,
                  background: torIsolated ? "#30d158" : "#333",
                  position: "relative" as const,
                  transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#fff",
                    position: "absolute" as const,
                    top: 2,
                    left: torIsolated ? 16 : 2,
                    transition: "left 0.2s",
                  }}
                />
              </div>
              <span style={{ fontSize: 12, color: torIsolated ? "#30d158" : "#666", whiteSpace: "nowrap" }}>
                {t("tor_only_room")}
              </span>
            </button>
          )}
        </form>

        <p style={{ fontSize: 13, color: "#444", marginTop: 12 }}>
          {t("press")}{t("press") ? " " : ""}
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
            {t("return_key")}
          </span>
          {" "}{t("to_enter")}
        </p>

        {/* Footer */}
        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "#333" }}>
            {t("e2e_no_accounts")}
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
            {t("how_it_works")} &rarr;
          </Link>
          <p style={{ fontSize: 11, color: "#333", marginTop: 24 }}>
            {t("powered_by")}{" "}
            <a
              href="https://artorias.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#333", textDecoration: "underline" }}
            >
              Artorias
            </a>
          </p>

          {/* Language selector */}
          <div style={{ marginTop: 16, position: "relative" }}>
            <button
              onClick={() => setShowLangPicker((v) => !v)}
              style={{
                fontSize: 12,
                color: "#555",
                background: "none",
                border: "1px solid #222",
                borderRadius: 4,
                padding: "4px 12px",
                cursor: "pointer",
              }}
            >
              {LANGUAGES.find((l) => l.code === lang)?.nativeName ?? "English"}
            </button>
            {showLangPicker && (
              <div
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#111",
                  border: "1px solid #333",
                  borderRadius: 8,
                  padding: "8px 0",
                  maxHeight: 280,
                  overflowY: "auto",
                  width: 200,
                  zIndex: 100,
                }}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangPicker(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 16px",
                      fontSize: 13,
                      color: l.code === lang ? "#3478f6" : "#aaa",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
