"use client";

import { estimateEntropy, type Strength } from "@/lib/entropy";
import { useI18n } from "@/lib/i18n/context";
import type { TranslationKey } from "@/lib/i18n/translations";

const labelKeys: Record<Strength, { key: TranslationKey; color: string }> = {
  weak: { key: "weak", color: "#ff453a" },
  ok: { key: "fair", color: "#ffd60a" },
  strong: { key: "strong", color: "#30d158" },
};

export default function EntropyHint({ password }: { password: string }) {
  const { t } = useI18n();
  if (!password) return null;

  const strength = estimateEntropy(password);
  const { key, color } = labelKeys[strength];

  return (
    <span style={{ color, fontSize: 13, fontWeight: 500 }}>
      {t(key)}
    </span>
  );
}
