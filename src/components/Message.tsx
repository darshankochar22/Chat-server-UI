import type { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  if (message.kind === 'system') {
    return (
      <div className="self-center bg-white/5 text-slate-300 text-[11px] px-3 py-1 rounded-md text-center max-w-[60%] my-1">
        {message.text}
      </div>
    );
  }

  const isSent = message.kind === 'sent';

  return (
    <div
      className={`
        inline-flex items-end gap-2
        max-w-fit px-3 py-1.5 rounded-xl
        ${isSent
          ? 'self-end bg-teal-600 text-white rounded-br-sm'
          : 'self-start bg-teal-600 text-white rounded-bl-sm'}
      `}
    >
      <span className="text-[14px] leading-snug break-words">
        {message.text}
      </span>

      <span className="text-[10px] opacity-70 whitespace-nowrap translate-y-[1px]">
        {message.time}
      </span>
    </div>
  );
}
