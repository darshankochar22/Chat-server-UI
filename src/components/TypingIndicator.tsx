export default function TypingIndicator() {
  return (
    <div className="self-start flex items-center gap-1.5 bg-black px-5 py-3.5 rounded-2xl rounded-bl-sm shadow-md">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-slate-300 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}