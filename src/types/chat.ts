export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'waiting'
  | 'matched'
  | 'disconnected'
  | 'reconnecting';

export type MessageKind = 'sent' | 'received' | 'system';

export interface ChatMessage {
  id: string;
  kind: MessageKind;
  text: string;
  time: string;
}

export type ServerPayload =
  | { type: 'ping' }
  | { type: 'info';       message: string }
  | { type: 'session_id'; message: string }
  | { type: 'status';     message: 'Matched' | 'Waiting' }
  | { type: 'chat';       message: string }
  | { type: 'typing';     status: boolean }
  | { type: 'error';      message: string };

export type ClientPayload =
  | { type: 'pong' }
  | { type: 'msg';    text: string }
  | { type: 'skip' }
  | { type: 'typing'; status: boolean };

