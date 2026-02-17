import type { ConnectionStatus } from '../types/chat';

interface Props {
  status: ConnectionStatus;
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
  connected:    'bg-emerald-400',
  waiting:      'bg-amber-400 animate-pulse',
  matched:      'bg-emerald-400',
  disconnected: 'bg-red-500',
  reconnecting: 'bg-orange-400 animate-pulse',
};

export default function Header({ status }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 dark:bg-black shadow-xl shadow-black/50 z-10 flex-shrink-0">
      <h1 className="flex items-center gap-3 text-white font-bold text-2xl tracking-tight">
        <span className="text-3xl"></span>
        Chat
      </h1>
      <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest text-white shadow-md ${BADGE[status]}`}>
        {LABEL[status]}
      </span>
    </header>
  );
}