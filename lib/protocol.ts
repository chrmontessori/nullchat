// WebSocket message protocol types

export interface ClientMessage {
  type: "message";
  payload: string; // base64 ciphertext
}

export interface ClientTerminate {
  type: "terminate";
}

export interface ClientIdentify {
  type: "identify";
  token: string; // ephemeral session token, stable across reconnects
}

export interface ClientAcknowledge {
  type: "acknowledge";
  ids: string[]; // message IDs the client confirms receiving
}

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
  code: "RATE_LIMITED" | "ROOM_FULL";
}

export type ServerEvent =
  | ServerMessage
  | ServerHistory
  | ServerPresence
  | ServerBurn
  | ServerDeleted
  | ServerConfirmed
  | ServerError;
