import nacl from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

// Argon2id parameters shared by the room-id and key derivations.
// 16 MiB of memory per derivation keeps it workable in constrained
// browsers such as Tor Browser while making each guess memory-hard.
export const ARGON2_PARAMS = {
  iterations: 3,
  memorySize: 16384, // KiB (16 MiB)
  parallelism: 1,
} as const;

// Domain-separation salts and prefixes for protocol v3.
const KEY_SALT = "nullchat-key-v3";
const ROOM_AUTH_PREFIX = "nullchat-room-auth-v3";

export const ENVELOPE_VERSION = 3;
// Receivers drop envelopes older than this. The longest server-side
// retention is 24 hours; the extra hour absorbs clock differences.
export const MAX_ENVELOPE_AGE_MS = 25 * 60 * 60 * 1000;
// Receivers drop envelopes stamped further than this into the future.
export const MAX_ENVELOPE_FUTURE_MS = 10 * 60 * 1000;

const ENVELOPE_ID_RE = /^[0-9a-f]{32}$/;

/**
 * Plaintext inside every encrypted payload. JSON key order on the wire
 * is v, id, alias, text, ts, nop.
 */
export interface MessageEnvelope {
  v: typeof ENVELOPE_VERSION;
  id: string; // 32 lowercase hex characters, random per envelope
  alias: string;
  text: string;
  ts: number;
  nop?: true; // cover traffic: receivers drop it after decryption
}

// Fixed plaintext size before encryption.
// All messages are padded to exactly this many bytes before secretbox,
// so every ciphertext is identical length regardless of message content.
// Sized to hold a full 4096-char message even when every character is a
// 3-byte UTF-8 sequence (CJK, Arabic, Cyrillic, etc.) plus envelope and
// JSON-escaping overhead.
const FIXED_PLAINTEXT_SIZE = 16384;

export function bytesToHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/** Lowercase hex string of `byteLength` bytes from crypto.getRandomValues. */
export function randomHex(byteLength: number): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(byteLength)));
}

export function generateAlias(): string {
  return randomHex(4);
}

export function roundTimestamp(ts: number): number {
  return Math.floor(ts / 60000) * 60000;
}

export interface DerivedKeys {
  encKey: Uint8Array; // 32-byte secretbox key
  auth: string; // 64 lowercase hex characters, sent in the hello frame
}

/**
 * auth = lowercase hex of SHA-256("nullchat-room-auth-v3" || authSecret).
 * The concatenated input is zeroed before returning.
 */
export async function computeRoomAuth(authSecret: Uint8Array): Promise<string> {
  const prefix = new TextEncoder().encode(ROOM_AUTH_PREFIX);
  const input = new Uint8Array(prefix.length + authSecret.length);
  input.set(prefix);
  input.set(authSecret, prefix.length);
  try {
    const digest = await crypto.subtle.digest("SHA-256", input);
    return bytesToHex(new Uint8Array(digest));
  } finally {
    input.fill(0);
  }
}

/**
 * Derive the encryption key and the room auth value from the shared
 * secret. Argon2id (salt "nullchat-key-v3") produces 64 bytes of key
 * material: bytes 0-31 are the encryption key and bytes 32-63 are the
 * auth secret, which is only used to compute the auth value.
 *
 * The salt differs from the room-id salt, so the room ID reveals
 * nothing about the key. The key material and auth secret are zeroed
 * before this function returns.
 */
export async function deriveKeys(secret: string): Promise<DerivedKeys> {
  const { argon2id } = await import("hash-wasm");
  const keyMaterial = await argon2id({
    password: secret,
    salt: new TextEncoder().encode(KEY_SALT),
    ...ARGON2_PARAMS,
    hashLength: 64,
    outputType: "binary",
  });
  const encKey = keyMaterial.slice(0, 32);
  const authSecret = keyMaterial.slice(32, 64);
  keyMaterial.fill(0);
  try {
    const auth = await computeRoomAuth(authSecret);
    return { encKey, auth };
  } catch (err) {
    encKey.fill(0);
    throw err;
  } finally {
    authSecret.fill(0);
  }
}

/**
 * Build a v3 envelope with a fresh random id. Object key order matches
 * the wire format (v, id, alias, text, ts, nop).
 */
export function createEnvelope(
  alias: string,
  text: string,
  options: { nop?: boolean; now?: number } = {}
): MessageEnvelope {
  const envelope: MessageEnvelope = {
    v: ENVELOPE_VERSION,
    id: randomHex(16),
    alias,
    text,
    ts: roundTimestamp(options.now ?? Date.now()),
  };
  if (options.nop) envelope.nop = true;
  return envelope;
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
  // Fill remaining bytes with random data (not zeros) so the padding
  // carries no distinguishable pattern
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

/** Decrypt and parse a payload. Returns null if authentication or parsing fails. */
function decryptPayload(ciphertext: string, key: Uint8Array): unknown {
  try {
    const combined = decodeBase64(ciphertext);
    const nonce = combined.slice(0, nacl.secretbox.nonceLength);
    const box = combined.slice(nacl.secretbox.nonceLength);
    const padded = nacl.secretbox.open(box, nonce, key);
    if (!padded) return null;
    return JSON.parse(unpadMessage(padded));
  } catch {
    return null;
  }
}

/**
 * Decrypt a received payload and apply the v3 acceptance rules.
 * Returns null (drops the message) when:
 *  - decryption or parsing fails
 *  - nop is set (cover traffic; `seenIds` is left untouched)
 *  - v !== 3, or a field is missing or has the wrong type
 *  - the envelope id is already in `seenIds`
 *  - ts is more than 25 hours old or more than 10 minutes in the future
 * On acceptance the envelope id is added to `seenIds`.
 */
export function openEnvelope(
  ciphertext: string,
  key: Uint8Array,
  seenIds: Set<string>,
  now: number = Date.now()
): MessageEnvelope | null {
  const parsed = decryptPayload(ciphertext, key);
  if (!parsed || typeof parsed !== "object") return null;
  const env = parsed as Record<string, unknown>;
  if (env.nop) return null;
  if (env.v !== ENVELOPE_VERSION) return null;
  if (typeof env.id !== "string" || !ENVELOPE_ID_RE.test(env.id)) return null;
  if (typeof env.alias !== "string" || typeof env.text !== "string") return null;
  if (typeof env.ts !== "number" || !Number.isFinite(env.ts)) return null;
  if (seenIds.has(env.id)) return null;
  if (now - env.ts > MAX_ENVELOPE_AGE_MS) return null;
  if (env.ts - now > MAX_ENVELOPE_FUTURE_MS) return null;
  seenIds.add(env.id);
  return { v: ENVELOPE_VERSION, id: env.id, alias: env.alias, text: env.text, ts: env.ts };
}
