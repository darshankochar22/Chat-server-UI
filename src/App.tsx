import { useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import LandingPage from './components/HomePage';

export default function App() {
  const [showChat, setShowChat] = useState(false);

  const {
    messages,
    status,
    isMatched,
    strangerTyping,
    sendMessage,
    skipPartner,
    notifyTyping,
  } = useWebSocket();

  if (!showChat) {
    return <LandingPage onStart={() => setShowChat(true)} />;
  }

  return (
    <div className="flex flex-col h-dvh w-screen overflow-hidden dark:bg-black">
      <Header status={status} />
      <MessageList messages={messages} strangerTyping={strangerTyping} />
      <InputArea
        isMatched={isMatched}
        onSend={sendMessage}
        onSkip={skipPartner}
        onType={notifyTyping}
      />
    </div>
  );
}