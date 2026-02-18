import type { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
}

export default function Message({ message }: Props) {
  if (message.kind === 'system') {
    return (
      <div className="self-center bg-white/5 text-slate-400 text-[11px] px-3 py-1 rounded-md text-center max-w-[55%] my-1">
        {message.text}
      </div>
    );
  }

  const isSent = message.kind === 'sent';

  return (
    <div
      className={`
        inline-flex flex-col
        max-w-[70%] w-fit
        px-3 py-1.5 rounded-xl
        ${isSent
          ? 'self-end bg-teal-600 text-white rounded-br-sm'
          : 'self-start bg-teal-600 text-white rounded-bl-sm'}
      `}
    >
      {/* username (optional future use) */}
      {!isSent && message.username && (
        <span className="text-[10px] text-teal-200 font-medium mb-[1px]">
          {message.username}
        </span>
      )}

      {/* message + time in one row */}
      <div className="inline-flex items-end gap-1.5">
        <span className="text-[14px] leading-snug break-words">
          {message.text}
        </span>

        <span className="text-[9px] opacity-60 whitespace-nowrap">
          {message.time}
        </span>
      </div>
    </div>
  );
}
