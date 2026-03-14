export type Strength = "weak" | "ok" | "strong";

export function estimateEntropy(password: string): Strength {
  if (!password) return "weak";

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  const entropy = password.length * Math.log2(poolSize || 1);

  if (entropy < 60) return "weak";
  if (entropy < 100) return "ok";
  return "strong";
}
