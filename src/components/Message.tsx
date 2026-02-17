import type { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  if (message.kind === 'system') {
    return (
      <div className="self-center bg-black text-slate-200 text-sm px-5 py-2 rounded-xl text-center max-w-[85%] my-1">
        {message.text}
      </div>
    );
  }

  const isSent = message.kind === 'sent';

  return (
    <div className={`flex flex-col gap-1 max-w-[72%] px-4 py-3 rounded-2xl shadow-lg
      ${isSent
        ? 'self-end bg-teal-600 text-white rounded-br-sm'
        : 'self-start bg-teal-600 text-white rounded-bl-sm'
      }`}
    >
      <span className="text-base leading-relaxed break-words">{message.text}</span>
      <span className={`text-xs self-end mt-0.5 ${isSent ? 'text-teal-200' : 'text-slate-300'}`}>
        {message.time}
      </span>
    </div>
  );
}