import Brand from "../Brand";

export default function TranscriptHeader({ videoTitle, duration, onBack }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-border bg-ink-surface/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          aria-label="Back to summary"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-border text-paper-muted transition-colors duration-150 hover:border-violet/60 hover:text-violet"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="hidden sm:block">
          <Brand />
        </div>

        <div className="min-w-0 border-l border-ink-border pl-4 sm:pl-4">
          <p className="eyebrow">Search, explore and navigate the complete transcript</p>
          <h1 className="mt-0.5 truncate font-display text-lg font-bold uppercase tracking-tight text-paper sm:text-xl">Transcript</h1>
        </div>
      </div>

      <div className="flex min-w-0 flex-col items-end text-right">
        <p className="max-w-[220px] truncate text-sm font-semibold text-paper sm:max-w-[320px]">{videoTitle || "Untitled video"}</p>
        <span className="font-mono text-xs text-paper-muted">{duration || "—"}</span>
      </div>
    </header>
  );
}
