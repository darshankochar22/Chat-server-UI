import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import LandingPage from './components/HomePage';
import Sidebar from './components/Sidebar';
import type { ChatSession } from './components/Sidebar';

export default function App() {
  const [showChat, setShowChat] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sessionStartRef = useRef<Date>(new Date());
  const prevIsMatchedRef = useRef(false);
  const skippedManuallyRef = useRef(false);

  const {
    messages,
    status,
    isMatched,
    strangerTyping,
    sendMessage,
    skipPartner,
    notifyTyping,
    username,
    setUsername,
    clearMessages,
  } = useWebSocket();

  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const getRealMessages = () =>
    messagesRef.current.filter((m) => m.kind !== 'system');

  useEffect(() => {
    const wasMatched = prevIsMatchedRef.current;

    if (!wasMatched && isMatched) {
      sessionStartRef.current = new Date();
      clearMessages(); // clean slate when new session starts
    }

    if (wasMatched && !isMatched) {
      if (skippedManuallyRef.current) {
        skippedManuallyRef.current = false;
      } else {
        // Stranger disconnected — archive then clear
        const real = getRealMessages();
        if (real.length > 0) {
          setSessions((prev) => [
            {
              id: `session-${Date.now()}`,
              startedAt: sessionStartRef.current,
              messages: real,
            },
            ...prev,
          ]);
        }
        clearMessages();
      }
    }

    prevIsMatchedRef.current = isMatched;
  }, [isMatched]);

  const handleSkip = () => {
    const real = getRealMessages();
    if (real.length > 0) {
      setSessions((prev) => [
        {
          id: `session-${Date.now()}`,
          startedAt: sessionStartRef.current,
          messages: real,
        },
        ...prev,
      ]);
    }
    skippedManuallyRef.current = true;
    setSelectedSession(null);
    sessionStartRef.current = new Date();
    clearMessages(); // clear immediately so old messages don't bleed into new session
    skipPartner();
  };

  if (!showChat) {
    return <LandingPage onStart={() => setShowChat(true)} />;
  }

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden dark:bg-black">
      <Sidebar
        sessions={sessions}
        onSelectSession={setSelectedSession}
        selectedSessionId={selectedSession?.id ?? null}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div
        className={`flex flex-col flex-1 h-full transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : ''
        }`}
      >
        <Header status={status} username={username} setUsername={setUsername} />

        {selectedSession ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="text-zinc-400 text-xs text-center py-2 px-4">
              Viewing past session from {selectedSession.startedAt.toLocaleString()} —{' '}
              <button
                className="text-blue-400 underline"
                onClick={() => setSelectedSession(null)}
              >
                back to current chat
              </button>
            </div>
            <MessageList messages={selectedSession.messages} strangerTyping={false} />
          </div>
        ) : (
          <>
            <MessageList messages={messages} strangerTyping={strangerTyping} />
            <InputArea
              isMatched={isMatched}
              onSend={sendMessage}
              onSkip={handleSkip}
              onType={notifyTyping}
            />
          </>
        )}
      </div>
    </div>
  );
}