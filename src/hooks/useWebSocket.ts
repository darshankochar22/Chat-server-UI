import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ChatMessage,
  ClientPayload,
  ConnectionStatus,
  ServerPayload,
} from '../types/chat';

const SERVER_URL = 'wss://20.193.154.3:8080';
const MAX_RECONNECT = 5;
export const MAX_CHARS = 500;

let _id = 0;
const uid = () => String(++_id);
const now = () =>
  new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

export function useWebSocket() {
  const wsRef          = useRef<WebSocket | null>(null);
  const attemptsRef    = useRef(0);
  const delayRef       = useRef(1000);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [messages,       setMessages]       = useState<ChatMessage[]>([]);
  const [status,         setStatus]         = useState<ConnectionStatus>('connecting');
  const [isMatched,      setIsMatched]      = useState(false);
  const [strangerTyping, setStrangerTyping] = useState(false);
  const [username,       setUsername]       = useState<string>(
    () => localStorage.getItem('chat_name') || 'Anonymous'
  );

  const push = useCallback(
    (kind: ChatMessage['kind'], text: string, username?: string) => {
      setMessages(prev => [
        ...prev,
        { id: uid(), kind, text, time: now(), username },
      ]);
    },
    []
  );

  const emit = useCallback((payload: ClientPayload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  // Persist username to localStorage
  useEffect(() => {
    localStorage.setItem('chat_name', username);
  }, [username]);

  // Send updated name to server whenever username changes
  useEffect(() => {
    if (!wsRef.current) return;
    if (wsRef.current.readyState !== WebSocket.OPEN) return;
    emit({ type: 'set_name', name: username });
  }, [username, emit]);

  const pushRef = useRef(push);
  const emitRef = useRef(emit);
  useEffect(() => { pushRef.current = push; }, [push]);
  useEffect(() => { emitRef.current = emit; }, [emit]);

  // Store latest username in a ref so onopen always has the current value
  const usernameRef = useRef(username);
  useEffect(() => { usernameRef.current = username; }, [username]);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      setStatus('reconnecting');

      let ws: WebSocket;
      try {
        ws = new WebSocket(SERVER_URL);
      } catch (e) {
        console.error('[ws] failed to construct WebSocket', e);
        return;
      }
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        attemptsRef.current = 0;
        delayRef.current    = 1000;
        setStatus('connected');
        emitRef.current({ type: 'set_name', name: usernameRef.current });
      };

      ws.onmessage = e => {
        if (cancelled) return;
        try {
          const raw = JSON.parse(e.data as string) as ServerPayload;
          switch (raw.type) {
            case 'ping':
              emitRef.current({ type: 'pong' });
              break;
            case 'info':
              pushRef.current('system', raw.message);
              break;
            case 'session_id':
              break;
            case 'status':
              if (raw.message === 'Matched') {
                setIsMatched(true);
                setStatus('matched');
                pushRef.current('system', '🎉 Connected with a stranger!');
              } else {
                setIsMatched(false);
                setStrangerTyping(false);
                setStatus('waiting');
              }
              break;
            case 'chat':
              setStrangerTyping(false);
              pushRef.current('received', raw.text, raw.username);
              break;
            case 'typing':
              setStrangerTyping(raw.status);
              break;
            case 'error':
              pushRef.current('system', '❌ ' + raw.message);
              break;
          }
        } catch { /* ignore malformed frames */ }
      };

      ws.onerror = err => console.error('[ws] error', err);

      ws.onclose = () => {
        if (cancelled) return;
        setStatus('disconnected');
        setIsMatched(false);
        setStrangerTyping(false);

        if (attemptsRef.current < MAX_RECONNECT) {
          attemptsRef.current++;
          setTimeout(connect, delayRef.current);
          delayRef.current = Math.min(delayRef.current * 2, 30_000);
        } else {
          pushRef.current('system', '❌ Could not reconnect. Please refresh the page.');
        }
      };
    }

    connect();

    return () => {
      cancelled = true;
      wsRef.current?.close();
    };
  }, []); // runs once on mount — intentional

  const sendMessage = useCallback(
    (text: string) => {
      const t = text.trim();
      if (!t || !isMatched) return;
      if (t.length > MAX_CHARS) { push('system', `❌ Max ${MAX_CHARS} characters`); return; }
      emit({ type: 'msg', text: t });
      push('sent', t, 'You');
      emit({ type: 'typing', status: false });
    },
    [isMatched, emit, push],
  );

  const skipPartner = useCallback(() => {
    if (!isMatched) return;
    emit({ type: 'skip' });
    setIsMatched(false);
    setStrangerTyping(false);
    push('system', '🔍 Looking for a new partner…');
  }, [isMatched, emit, push]);

  const notifyTyping = useCallback(
    (value: string) => {
      if (!isMatched) return;
      if (value.length > 0) {
        emit({ type: 'typing', status: true });
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        typingTimerRef.current = setTimeout(
          () => emit({ type: 'typing', status: false }),
          3000,
        );
      } else {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
        emit({ type: 'typing', status: false });
      }
    },
    [isMatched, emit],
  );

  return {
    messages,
    status,
    isMatched,
    strangerTyping,
    sendMessage,
    skipPartner,
    notifyTyping,
    username,
    setUsername,
  };
}