/**
 * Derive room ID using Argon2id with a fixed domain-separation salt
 * so the room ID cannot be used to crack the encryption key (which
 * uses a different salt). Both derivations use Argon2id to ensure
 * brute-force resistance on both paths.
 */
export async function deriveRoomId(password: string): Promise<string> {
  const { argon2id } = await import("hash-wasm");
  const salt = new TextEncoder().encode("nullchat-room-id-v2");
  return argon2id({
    password,
    salt,
    iterations: 3,
    memorySize: 16384, // 16 MiB — compatible with Tor Browser
    hashLength: 32,
    parallelism: 1,
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
