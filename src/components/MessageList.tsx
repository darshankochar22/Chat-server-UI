import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types/chat';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface Props {
  messages: ChatMessage[];
  strangerTyping: boolean;
}

export default function MessageList({ messages, strangerTyping }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, strangerTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-1 text-center px-10 dark:bg-black">
        <h2 className="text-3xl font-bold text-white">Welcome!</h2>
        <p className="text-lg text-slate-400">Connect with random strangers anonymously</p>
      </div>
    );
  }

return (
  <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-4 py-4 bg-black">
    {messages.map(msg => (
      <Message key={msg.id} message={msg} />
    ))}
    {strangerTyping && <TypingIndicator />}
    <div ref={bottomRef} />
  </div>
);
}