import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-ink-border bg-ink-surface px-3 py-3">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about this video…"
        rows={1}
        disabled={disabled}
        className="max-h-24 flex-1 resize-none rounded-xl border border-ink-border bg-ink px-3.5 py-2.5 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet text-ink transition-transform duration-150 hover:scale-105 disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Send message"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}
