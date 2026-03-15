import { writeFileSync, readFileSync, renameSync, unlinkSync, readdirSync, mkdirSync, chmodSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = process.env.NULLCHAT_DATA_DIR || "/var/lib/nullchat/rooms";

interface PersistedRoom {
  messages: {
    id: string;
    payload: string;
    ts: number;
    senderId: string;
    readAt: number | null;
    expiresAt: number;
  }[];
  hasHadReply: boolean;
}

/** Ensure data directory exists with restricted permissions (owner-only) */
export function initStorage() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  chmodSync(DATA_DIR, 0o700);
}

function roomPath(roomId: string): string {
  // Sanitize: room IDs are hex strings from Argon2, but guard against traversal
  const safe = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
  return join(DATA_DIR, `${safe}.json`);
}

/** Atomic write: write to temp file then rename */
export function saveRoom(roomId: string, state: PersistedRoom) {
  const filePath = roomPath(roomId);
  const tmpPath = `${filePath}.tmp`;
  writeFileSync(tmpPath, JSON.stringify(state), { mode: 0o600 });
  renameSync(tmpPath, filePath);
}

/** Load room state from disk, pruning expired messages */
export function loadRoom(roomId: string): PersistedRoom | null {
  const filePath = roomPath(roomId);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const state: PersistedRoom = JSON.parse(raw);
    const now = Date.now();
    state.messages = state.messages.filter((m) => m.expiresAt > now);
    if (state.messages.length === 0) {
      state.hasHadReply = false;
      // No messages left — clean up the file
      try { unlinkSync(filePath); } catch {}
    }
    return state.messages.length > 0 ? state : null;
  } catch {
    return null;
  }
}

/** Delete room file from disk */
export function deleteRoom(roomId: string) {
  try { unlinkSync(roomPath(roomId)); } catch {}
}

/** Scan all persisted rooms and delete expired ones */
export function purgeExpiredRooms() {
  try {
    const files = readdirSync(DATA_DIR);
    const now = Date.now();
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = join(DATA_DIR, file);
      try {
        const raw = readFileSync(filePath, "utf-8");
        const state: PersistedRoom = JSON.parse(raw);
        const alive = state.messages.some((m) => m.expiresAt > now);
        if (!alive) unlinkSync(filePath);
      } catch {
        // Corrupt file — remove it
        try { unlinkSync(filePath); } catch {}
      }
    }
  } catch {}
}
