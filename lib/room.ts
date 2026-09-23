import { ARGON2_PARAMS } from "./crypto";

/**
 * Derive the room ID: lowercase hex of Argon2id(secret, salt
 * "nullchat-room-id-v3", 32 bytes), i.e. 64 hex characters.
 *
 * The salt differs from the key-derivation salt, so the room ID the
 * server sees cannot be used to recover the encryption key. Both paths
 * use Argon2id, so guessing the secret from the room ID is as costly
 * as guessing it from the key.
 */
export async function deriveRoomId(secret: string): Promise<string> {
  const { argon2id } = await import("hash-wasm");
  return argon2id({
    password: secret,
    salt: new TextEncoder().encode("nullchat-room-id-v3"),
    ...ARGON2_PARAMS,
    hashLength: 32,
    outputType: "hex",
  });
}

export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
