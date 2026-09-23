// WebSocket message protocol types (protocol v3)

// ── Client → server ──

/** First frame after the socket opens. */
export interface ClientHello {
  type: "hello";
  token: string; // ephemeral session token, stable across reconnects
  auth: string; // 64 lowercase hex characters derived from the shared secret
}

export interface ClientMessage {
  type: "message";
  payload: string; // base64 ciphertext
  c: 0 | 1; // 0 = real message, 1 = cover traffic
}

export interface ClientTerminate {
  type: "terminate";
}

export interface ClientAcknowledge {
  type: "acknowledge";
  ids: string[]; // message IDs the client confirms receiving
}

export type ClientEvent =
  | ClientHello
  | ClientMessage
  | ClientTerminate
  | ClientAcknowledge;

// ── Server → client ──

export interface ServerMessage {
  type: "message";
  payload: string;
  id: string;
  ts: number;
  expiresAt: number;
}

export interface ServerHistory {
  type: "history";
  messages: { payload: string; id: string; ts: number; burnAt: number | null; expiresAt: number }[];
}

export interface ServerPresence {
  type: "presence";
  othersHere: boolean;
}

export interface ServerBurn {
  type: "burn";
  id: string;
  burnAt: number; // timestamp when message will be deleted
}

export interface ServerDeleted {
  type: "deleted";
  ids: string[];
}

export interface ServerConfirmed {
  type: "confirmed";
  id: string;
}

export interface ServerError {
  type: "error";
  code: "RATE_LIMITED" | "ROOM_FULL" | "AUTH_FAILED";
}

export type ServerEvent =
  | ServerMessage
  | ServerHistory
  | ServerPresence
  | ServerBurn
  | ServerDeleted
  | ServerConfirmed
  | ServerError;
