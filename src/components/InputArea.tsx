import { useRef, useState } from 'react';
import { MAX_CHARS } from '../hooks/useWebSocket';

interface Props {
  isMatched: boolean;
  onSend: (text: string) => void;
  onSkip: () => void;
  onType: (value: string) => void;
}

export default function InputArea({ isMatched, onSend, onSkip, onType }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.slice(0, MAX_CHARS);
    setValue(v);
    onType(v);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || !isMatched) return;
    onSend(trimmed);
    setValue('');
    onType('');
    inputRef.current?.focus();
  };

  const count = value.length;
  const charColor =
    count >= MAX_CHARS       ? 'text-red-400' :
    count >= MAX_CHARS * 0.9 ? 'text-amber-400' :
                               'text-slate-400';

  const canSend = isMatched && value.trim().length > 0;

  return (
    <div className="flex-shrink-0 dark:bg-black px-5 pt-3 pb-5">
      {/* Char counter */}
      <p className={`text-xs text-right mb-2 font-mono transition-colors ${charColor}`}>
        {count} / {MAX_CHARS}
      </p>

      {/* Row */}
      <div className="flex items-center gap-3">
        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={isMatched ? 'Type a message…' : 'Waiting for a match…'}
          value={value}
          disabled={!isMatched}
          autoComplete="off"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-black text-white text-base placeholder-slate-400
                     rounded-full px-6 py-3.5 outline-none border-2 border-slate-600
                     focus:bg-black
                     disabled:bg-black disabled:text-slate-600
                     disabled:placeholder-slate-700 disabled:cursor-not-allowed
                     transition-all duration-200"
        />

        {/* Send button */}
        <button
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className="w-14 h-14 flex items-center justify-center rounded-full
                     bg-black text-white text-xl font-bold flex-shrink-0
                     shadow-lg shadow-teal-900/50 transition-all duration-150
                     hover:bg-teal-500 active:scale-95
                     disabled:bg-slate-700 disabled:text-slate-500
                     disabled:shadow-none disabled:cursor-not-allowed"
        >
          ➤
        </button>

        {/* Skip button */}
        <button
          onClick={onSkip}
          disabled={!isMatched}
          aria-label="Skip partner"
          className="w-14 h-14 flex items-center justify-center rounded-full
                     bg-red-700 text-white text-xl flex-shrink-0
                     shadow-lg shadow-red-900/50 transition-all duration-150
                     hover:bg-red-600 active:scale-95
                     disabled:bg-slate-700 disabled:text-slate-500
                     disabled:shadow-none disabled:cursor-not-allowed"
        >
          ⏭
        </button>
      </div>
    </div>
  );
}