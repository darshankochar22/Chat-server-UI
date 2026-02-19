import type { ChatMessage } from '../types/chat';

export interface ChatSession {
  id: string;
  startedAt: Date;
  messages: ChatMessage[];
}

interface SidebarProps {
  sessions: ChatSession[];
  onSelectSession: (session: ChatSession | null) => void;
  selectedSessionId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  sessions,
  onSelectSession,
  selectedSessionId,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
        title={isOpen ? 'Close history' : 'Open history'}
      >
        {isOpen ? (
          // X icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // History / clock icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-zinc-700 z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 pt-16 border-b border-zinc-700">
          <p className="text-zinc-500 text-xs mt-1">{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 text-sm px-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              No past sessions yet. Start chatting!
            </div>
          ) : (
            <ul>
              {sessions.map((session, index) => {
                const lastMsg = session.messages[session.messages.length - 1];
                const isSelected = selectedSessionId === session.id;
                return (
                  <li key={session.id}>
                    <button
                      onClick={() => onSelectSession(isSelected ? null : session)}
                      className={`w-full text-left px-4 py-1 transition-colors ${
                        isSelected ? 'bg-zinc-800 border-l-2' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-xs font-medium">
                          Session #{sessions.length - index}
                        </span>
                        <span className="text-zinc-500 text-xs">
                          {formatTime(session.startedAt)}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs truncate">
                        {lastMsg
                          ? `${lastMsg.kind === 'sent' ? 'You' : lastMsg.kind === 'received' ? 'Stranger' : '•'}: ${lastMsg.text}`
                          : 'No messages'}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}