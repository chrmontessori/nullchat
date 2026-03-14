"use client";

import { estimateEntropy, type Strength } from "@/lib/entropy";

const labels: Record<Strength, { text: string; color: string }> = {
  weak: { text: "weak", color: "#ff453a" },
  ok: { text: "fair", color: "#ffd60a" },
  strong: { text: "strong", color: "#30d158" },
};

export default function EntropyHint({ password }: { password: string }) {
  if (!password) return null;

  const strength = estimateEntropy(password);
  const { text, color } = labels[strength];

  return (
    <span style={{ color, fontSize: 13, fontWeight: 500 }}>
      {text}
    </span>
  );
}
