import { writeFile, rename, unlink, readdir, readFileSync, mkdirSync, chmodSync, existsSync } from "fs";
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
  const safe = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
  return join(DATA_DIR, `${safe}.json`);
}

/** Async atomic write: write to temp file then rename (non-blocking) */
export function saveRoom(roomId: string, state: PersistedRoom) {
  const filePath = roomPath(roomId);
  const tmpPath = `${filePath}.tmp`;
  writeFile(tmpPath, JSON.stringify(state), { mode: 0o600 }, (err) => {
    if (err) return;
    rename(tmpPath, filePath, () => {});
  });
}

/** Load room state from disk (sync — only called once on room creation) */
export function loadRoom(roomId: string): PersistedRoom | null {
  const filePath = roomPath(roomId);
  try {
    const raw = readFileSync(filePath, "utf-8");
    const state: PersistedRoom = JSON.parse(raw);
    const now = Date.now();
    state.messages = state.messages.filter((m) => m.expiresAt > now);
    if (state.messages.length === 0) {
      state.hasHadReply = false;
      unlink(filePath, () => {});
    }
    return state.messages.length > 0 ? state : null;
  } catch {
    return null;
  }
}

/** Delete room file from disk (async) */
export function deleteRoom(roomId: string) {
  unlink(roomPath(roomId), () => {});
}

/** Scan all persisted rooms and delete expired ones */
export function purgeExpiredRooms() {
  readdir(DATA_DIR, (err, files) => {
    if (err || !files) return;
    const now = Date.now();
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const filePath = join(DATA_DIR, file);
      try {
        const raw = readFileSync(filePath, "utf-8");
        const state: PersistedRoom = JSON.parse(raw);
        const alive = state.messages.some((m) => m.expiresAt > now);
        if (!alive) unlink(filePath, () => {});
      } catch {
        unlink(filePath, () => {});
      }
    }
  });
}
