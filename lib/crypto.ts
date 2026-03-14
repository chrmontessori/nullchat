import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

// Argon2id parameters: memory-hard KDF resistant to GPU/ASIC attacks
const ARGON2_MEM_KIB = 65536; // 64 MiB
const ARGON2_TIME = 3; // iterations
const ARGON2_PARALLELISM = 1;

export interface MessageEnvelope {
  alias: string;
  text: string;
  ts: number;
  nop?: boolean; // true = decoy traffic, discard after decryption
}

// Fixed plaintext size before encryption.
// All messages are padded to exactly this many bytes before secretbox,
// so every ciphertext is identical length regardless of message content.
// 8192 bytes covers max message (4096 chars JSON-encoded + envelope overhead).
const FIXED_PLAINTEXT_SIZE = 8192;

export function generateAlias(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function roundTimestamp(ts: number): number {
  return Math.floor(ts / 60000) * 60000;
}

/**
 * Derive encryption key using Argon2id with a fixed domain-separation
 * salt independent from the room ID, so knowing the room ID does
 * not help an attacker crack the key.
 *
 * Argon2id is memory-hard: each guess requires 64 MiB of RAM,
 * neutralizing GPU/ASIC brute-force attacks on weak passwords.
 */
export async function deriveKey(password: string): Promise<Uint8Array> {
  const { argon2id } = await import("hash-wasm");
  const salt = new TextEncoder().encode("nullchat-encryption-key-v2");
  const hashHex = await argon2id({
    password,
    salt,
    iterations: ARGON2_TIME,
    memorySize: ARGON2_MEM_KIB,
    hashLength: 32,
    parallelism: ARGON2_PARALLELISM,
    outputType: "hex",
  });
  // Convert hex to Uint8Array
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 64; i += 2) {
    bytes[i / 2] = parseInt(hashHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Derive a short safety number from the encryption key and a server-provided
 * room nonce. The nonce is regenerated each time a room is created, so the
 * safety number changes when a room dies and is re-entered with the same
 * secret. Both users should see the same fingerprint — if they don't,
 * someone may be in a different room (wrong secret or MITM).
 */
export async function deriveFingerprint(key: Uint8Array, roomNonce: string): Promise<string> {
  const nonceBytes = new TextEncoder().encode(roomNonce);
  const combined = new Uint8Array(key.length + nonceBytes.length);
  combined.set(key);
  combined.set(nonceBytes, key.length);
  const hash = await crypto.subtle.digest("SHA-256", combined.buffer as ArrayBuffer);
  const bytes = new Uint8Array(hash).slice(0, 5);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

function padMessage(plaintext: string): Uint8Array {
  const encoded = new TextEncoder().encode(plaintext);
  // 2-byte length prefix + content must fit in fixed size
  if (encoded.length + 2 > FIXED_PLAINTEXT_SIZE) {
    throw new Error("Message too large for fixed padding");
  }
  const padded = new Uint8Array(FIXED_PLAINTEXT_SIZE);
  // Store content length as 2-byte big-endian prefix
  padded[0] = (encoded.length >> 8) & 0xff;
  padded[1] = encoded.length & 0xff;
  padded.set(encoded, 2);
  // Fill remaining bytes with random data (not zeros) to prevent
  // any distinguishable pattern in the plaintext
  const noise = crypto.getRandomValues(new Uint8Array(FIXED_PLAINTEXT_SIZE - 2 - encoded.length));
  padded.set(noise, 2 + encoded.length);
  return padded;
}

function unpadMessage(padded: Uint8Array): string {
  // Read 2-byte big-endian length prefix
  const len = (padded[0] << 8) | padded[1];
  if (len + 2 > padded.length) {
    throw new Error("Invalid padding");
  }
  return new TextDecoder().decode(padded.slice(2, 2 + len));
}

export function encrypt(
  envelope: MessageEnvelope,
  key: Uint8Array
): string {
  const plaintext = JSON.stringify(envelope);
  const padded = padMessage(plaintext);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const box = nacl.secretbox(padded, nonce, key);

  const combined = new Uint8Array(nonce.length + box.length);
  combined.set(nonce);
  combined.set(box, nonce.length);
  return encodeBase64(combined);
}

export function decrypt(
  ciphertext: string,
  key: Uint8Array
): MessageEnvelope | null {
  try {
    const combined = decodeBase64(ciphertext);
    const nonce = combined.slice(0, nacl.secretbox.nonceLength);
    const box = combined.slice(nacl.secretbox.nonceLength);
    const padded = nacl.secretbox.open(box, nonce, key);
    if (!padded) return null;
    const plaintext = unpadMessage(padded);
    const envelope: MessageEnvelope = JSON.parse(plaintext);
    // Discard decoy/no-op messages
    if (envelope.nop) return null;
    return envelope;
  } catch {
    return null;
  }
}
