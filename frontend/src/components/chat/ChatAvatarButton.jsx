export default function ChatAvatarButton({ onClick, hasUnread = false }) {
  return (
    <button
      onClick={onClick}
      aria-label="Chat with this video"
      className="group fixed bottom-6 right-6 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-violet shadow-lg shadow-violet/30 transition-transform duration-200 hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 rounded-full bg-violet/50 animate-ping" />
      <span className="relative flex h-full w-full items-center justify-center rounded-full bg-violet">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#14131A" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </span>
      {hasUnread && <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-ink bg-coral" />}
    </button>
  );
}
