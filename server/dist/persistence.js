"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initStorage = initStorage;
exports.saveRoom = saveRoom;
exports.loadRoom = loadRoom;
exports.deleteRoom = deleteRoom;
exports.purgeExpiredRooms = purgeExpiredRooms;
const fs_1 = require("fs");
const path_1 = require("path");
const DATA_DIR = process.env.NULLCHAT_DATA_DIR || "/var/lib/nullchat/rooms";
/** Ensure data directory exists with restricted permissions (owner-only) */
function initStorage() {
    if (!(0, fs_1.existsSync)(DATA_DIR)) {
        (0, fs_1.mkdirSync)(DATA_DIR, { recursive: true });
    }
    (0, fs_1.chmodSync)(DATA_DIR, 0o700);
}
function roomPath(roomId) {
    const safe = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
    return (0, path_1.join)(DATA_DIR, `${safe}.json`);
}
/** Async atomic write: write to temp file then rename (non-blocking) */
function saveRoom(roomId, state) {
    const filePath = roomPath(roomId);
    const tmpPath = `${filePath}.tmp`;
    (0, fs_1.writeFile)(tmpPath, JSON.stringify(state), { mode: 0o600 }, (err) => {
        if (err)
            return;
        (0, fs_1.rename)(tmpPath, filePath, () => { });
    });
}
/** Load room state from disk (sync — only called once on room creation) */
function loadRoom(roomId) {
    const filePath = roomPath(roomId);
    try {
        const raw = (0, fs_1.readFileSync)(filePath, "utf-8");
        const state = JSON.parse(raw);
        const now = Date.now();
        state.messages = state.messages.filter((m) => m.expiresAt > now);
        if (state.messages.length === 0) {
            state.hasHadReply = false;
            (0, fs_1.unlink)(filePath, () => { });
        }
        return state.messages.length > 0 ? state : null;
    }
    catch {
        return null;
    }
}
/** Delete room file from disk (async) */
function deleteRoom(roomId) {
    (0, fs_1.unlink)(roomPath(roomId), () => { });
}
/** Scan all persisted rooms and delete expired ones */
function purgeExpiredRooms() {
    (0, fs_1.readdir)(DATA_DIR, (err, files) => {
        if (err || !files)
            return;
        const now = Date.now();
        for (const file of files) {
            if (!file.endsWith(".json"))
                continue;
            const filePath = (0, path_1.join)(DATA_DIR, file);
            try {
                const raw = (0, fs_1.readFileSync)(filePath, "utf-8");
                const state = JSON.parse(raw);
                const alive = state.messages.some((m) => m.expiresAt > now);
                if (!alive)
                    (0, fs_1.unlink)(filePath, () => { });
            }
            catch {
                (0, fs_1.unlink)(filePath, () => { });
            }
        }
    });
}
