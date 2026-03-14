import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

const BLOCK_SIZE = 256;
const PBKDF2_ITERATIONS = 100000;

export interface MessageEnvelope {
  alias: string;
  text: string;
  ts: number;
}

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
 * Derive encryption key using PBKDF2 with a fixed domain-separation
 * salt independent from the room ID, so knowing the room ID does
 * not help an attacker crack the key.
 */
export async function deriveKey(password: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const salt = encoder.encode("nullchat-encryption-key-v1");
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  return new Uint8Array(bits);
}

function padMessage(plaintext: string): Uint8Array {
  const encoded = new TextEncoder().encode(plaintext);
  // Add 1-64 random extra bytes before rounding up to block size
  // to prevent exact block-boundary length analysis
  const jitter = (crypto.getRandomValues(new Uint8Array(1))[0] % 64) + 1;
  const paddedLen =
    Math.ceil((encoded.length + jitter) / BLOCK_SIZE) * BLOCK_SIZE;
  const padded = new Uint8Array(paddedLen);
  padded.set(encoded);
  const padCount = paddedLen - encoded.length;
  for (let i = encoded.length; i < paddedLen; i++) {
    padded[i] = padCount;
  }
  return padded;
}

function unpadMessage(padded: Uint8Array): string {
  const padCount = padded[padded.length - 1];
  if (padCount === 0 || padCount > BLOCK_SIZE) {
    throw new Error("Invalid padding");
  }
  const unpaddedLen = padded.length - padCount;
  return new TextDecoder().decode(padded.slice(0, unpaddedLen));
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
    return JSON.parse(plaintext);
  } catch {
    return null;
  }
}
