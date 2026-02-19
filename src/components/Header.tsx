import type { ConnectionStatus } from '../types/chat';
import type { Dispatch, SetStateAction } from 'react';

interface Props {
  status: ConnectionStatus;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
}

const LABEL: Record<ConnectionStatus, string> = {
  connecting:   'Connecting…',
  connected:    'Connected',
  waiting:      'Searching…',
  matched:      'Chatting',
  disconnected: 'Disconnected',
  reconnecting: 'Reconnecting…',
};

const BADGE: Record<ConnectionStatus, string> = {
  connecting:   'bg-amber-400 animate-pulse',
  connected:    'bg-teal-600',
  waiting:      'bg-amber-400 animate-pulse',
  matched:      'bg-teal-600',
  disconnected: 'bg-red-500',
  reconnecting: 'bg-orange-400 animate-pulse',
};

export default function Header({ status, username, setUsername }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 dark:bg-black shadow-xl shadow-black/50 z-10 flex-shrink-0">
      <h1 className="flex items-center gap-3  px-8 text-white font-bold text-2xl tracking-tight">
        <span className="text-3xl"></span>
        Chat
      </h1>

      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Your name"
        maxLength={20}
        className="bg-transparent border-b border-white/30 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/70 text-center w-28"
      />

      <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest text-white shadow-md ${BADGE[status]}`}>
        {LABEL[status]}
      </span>
    </header>
  );
}