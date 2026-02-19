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
  username ?: string;
}

export type ServerPayload =
  | { type: 'ping' }
  | { type: 'info';       message: string }
  | { type: 'session_id'; message: string }
  | { type: 'status';     message: 'Matched' | 'Waiting' }
  | { type: 'chat';       text: string ;username?: string}
  | { type: 'typing';     status: boolean }
  | { type: 'error';      message: string };

export type ClientPayload =
  | { type: 'pong' }
  | { type: 'msg';    text: string }
  | { type: 'skip' }
  | { type: 'typing'; status: boolean }
  | { type: 'set_name'; name: string }
  | { type: 'identify'; browser_token: string }

