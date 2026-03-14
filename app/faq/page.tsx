"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { faqTranslations, type FaqKey } from "@/lib/i18n/faq-translations";

export default function FAQ() {
  const { t, lang } = useI18n();

  const tf = (key: FaqKey): string => {
    return faqTranslations[lang]?.[key] ?? faqTranslations.en[key] ?? key;
  };

  const sections: { title: string; body: React.ReactNode }[] = [
    { title: tf("faq_1_title"), body: tf("faq_1_body") },
    { title: tf("faq_2_title"), body: tf("faq_2_body") },
    { title: tf("faq_3_title"), body: tf("faq_3_body") },
    { title: tf("faq_4_title"), body: tf("faq_4_body") },
    { title: tf("faq_5_title"), body: tf("faq_5_body") },
    { title: tf("faq_6_title"), body: tf("faq_6_body") },
    { title: tf("faq_7_title"), body: tf("faq_7_body") },
    { title: tf("faq_8_title"), body: tf("faq_8_body") },
    { title: tf("faq_9_title"), body: tf("faq_9_body") },
    { title: tf("faq_10_title"), body: tf("faq_10_body") },
    { title: tf("faq_11_title"), body: tf("faq_11_body") },
    { title: tf("faq_12_title"), body: tf("faq_12_body") },
    { title: tf("faq_13_title"), body: tf("faq_13_body") },
    { title: tf("faq_14_title"), body: tf("faq_14_body") },
    { title: tf("faq_15_title"), body: tf("faq_15_body") },
    {
      title: tf("faq_16_title"),
      body: (
        <>
          {tf("faq_16_body_1")}
          <br /><br />
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#3478f6", wordBreak: "break-all" }}>
            http://5ril7wg5rvrpc25l2vjkwufmum26gwzrk5hf2mvfjkdrsyj3p54a52yd.onion
          </span>
          <br /><br />
          {tf("faq_16_body_2")}
        </>
      ),
    },
    { title: tf("faq_17_title"), body: tf("faq_17_body") },
    { title: tf("faq_18_title"), body: tf("faq_18_body") },
    { title: tf("faq_19_title"), body: tf("faq_19_body") },
    { title: tf("faq_20_title"), body: tf("faq_20_body") },
    { title: tf("faq_21_title"), body: tf("faq_21_body") },
    { title: tf("faq_22_title"), body: tf("faq_22_body") },
    { title: tf("faq_23_title"), body: tf("faq_23_body") },
    { title: tf("faq_24_title"), body: tf("faq_24_body") },
    { title: tf("faq_25_title"), body: tf("faq_25_body") },
    { title: tf("faq_26_title"), body: tf("faq_26_body") },
    { title: tf("faq_27_title"), body: tf("faq_27_body") },
    { title: tf("faq_28_title"), body: tf("faq_28_body") },
    { title: tf("faq_29_title"), body: tf("faq_29_body") },
    {
      title: tf("faq_30_title"),
      body: (
        <>
          {tf("faq_30_body_1")}{" "}
          <a href="https://github.com/chrmontessori/nullchat" target="_blank" rel="noopener noreferrer" style={{ color: "#3478f6", textDecoration: "none" }}>
            github.com/chrmontessori/nullchat
          </a>
          {tf("faq_30_body_2")}
        </>
      ),
    },
    {
      title: tf("faq_31_title"),
      body: (
        <>
          {tf("faq_31_body_1")}{" "}
          <a href="https://artorias.com" target="_blank" rel="noopener noreferrer" style={{ color: "#3478f6", textDecoration: "none" }}>
            artorias.com
          </a>
          .
        </>
      ),
    },
    { title: tf("faq_32_title"), body: tf("faq_32_body") },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#000",
        color: "#fff",
        padding: "60px 20px 80px",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <Link
            href="/"
            style={{
              fontSize: 14,
              color: "#3478f6",
              textDecoration: "none",
            }}
          >
            &larr; {t("back")}
          </Link>
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {t("how_it_works")}
        </h1>
        <p style={{ fontSize: 16, color: "#666", marginBottom: 56 }}>
          {t("faq_subtitle")}
        </p>

        {/* Sections */}
        <div>
          {sections.map((s, i) => (
            <div
              key={i}
              style={{
                borderTop: "1px solid #222",
                padding: "32px 0",
              }}
            >
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: "#fff",
                }}
              >
                {s.title}
              </h2>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#aaa",
                  whiteSpace: "pre-line",
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #222",
            paddingTop: 32,
            marginTop: 16,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 13, color: "#444" }}>
            {t("faq_footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
