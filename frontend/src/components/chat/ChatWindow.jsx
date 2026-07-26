import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ExportPanel from "./ExportPanel";

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-ink-border bg-ink-surface2 px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-pulseBar rounded-full bg-violet [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulseBar rounded-full bg-violet [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulseBar rounded-full bg-violet [animation-delay:300ms]" />
      </div>
    </div>
  );
}

export default function ChatWindow({ open, onClose, videoTitle, videoId, messages, isThinking, onSend, onRetry, onSeek }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking, open]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm sm:bg-ink/40" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Chat with this video"
        className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-ink-surface animate-fadeUp sm:inset-auto sm:bottom-8 sm:right-8 sm:h-[600px] sm:w-[400px] sm:rounded-3xl sm:border sm:border-ink-border sm:shadow-2xl sm:shadow-black/50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 0%, rgba(139,127,255,0.12), transparent 45%), radial-gradient(circle at 85% 100%, rgba(255,139,107,0.1), transparent 45%)",
        }}
      >
        <div className="relative z-20 flex items-center justify-between gap-3 border-b border-ink-border bg-ink-surface/95 px-4 py-3.5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14131A" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-display text-sm font-bold uppercase tracking-tight text-paper">ClipMind Assistant</p>
              <p className="truncate font-mono text-[11px] text-paper-muted">{videoTitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ExportPanel videoTitle={videoTitle} videoId={videoId} messages={messages} />
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="themed-scroll relative z-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
              <span className="eyebrow">Ask anything about this video</span>
              <p className="text-xs text-paper-muted">
                "What does the presenter say about pricing?" · "Summarize the middle section" · "When do they mention the API?"
              </p>
            </div>
          )}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onSeek={onSeek} onRetry={onRetry} />
          ))}
          {isThinking && <TypingIndicator />}
        </div>

        <ChatInput onSend={onSend} disabled={isThinking} />
      </div>
    </>
  );
}
