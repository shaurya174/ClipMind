function TimestampChip({ source, onSeek }) {
  return (
    <button
      onClick={() => onSeek?.(source.start_time)}
      className="rounded-full border border-coral/40 bg-coral/10 px-2.5 py-1 font-mono text-[11px] text-coral transition-colors duration-150 hover:bg-coral/20"
    >
      {source.start_time} – {source.end_time}
    </button>
  );
}

export default function ChatMessage({ message, onSeek, onRetry }) {
  const isUser = message.role === "user";

  if (message.failed) {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-danger/30 bg-danger/10 px-4 py-3 animate-fadeUp">
          <p className="text-sm text-danger">Couldn't get an answer for that. The connection may have dropped.</p>
          <button
            onClick={() => onRetry?.(message.id, message.failedQuestion)}
            className="mt-2 font-mono text-[11px] uppercase tracking-wide text-danger underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed shadow-sm animate-fadeUp ${
          isUser ? "rounded-2xl rounded-br-sm bg-violet text-ink" : "rounded-2xl rounded-bl-sm border border-ink-border bg-ink-surface2 text-paper"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>

        {!isUser && message.relatedTopic && !message.usedTranscript && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-paper-muted">
            Answered from general knowledge — not directly in this video
          </p>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.sources.map((source, i) => (
              <TimestampChip key={i} source={source} onSeek={onSeek} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
