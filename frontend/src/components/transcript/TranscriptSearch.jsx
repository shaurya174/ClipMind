import { forwardRef } from "react";

const TranscriptSearch = forwardRef(function TranscriptSearch(
  { value, onChange, matchCount, hasSearchTerm, currentIndex, totalMatches, onPrev, onNext },
  ref
) {
  return (
    <div className="sticky top-0 z-10 border-b border-ink-border bg-ink-surface/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2.5 rounded-full border border-ink-border bg-ink px-4 py-2.5">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-paper-muted">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search the transcript…"
          autoFocus
          className="w-full min-w-0 bg-transparent text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none"
        />
        {hasSearchTerm && (
          <button onClick={() => onChange("")} aria-label="Clear search" className="shrink-0 text-paper-muted hover:text-paper">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {hasSearchTerm && (
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="font-mono text-xs text-paper-muted">
            {matchCount} {matchCount === 1 ? "match" : "matches"} found
          </span>

          {totalMatches > 0 && (
            <div className="flex items-center gap-1">
              <span className="mr-1 font-mono text-xs text-paper-muted">
                {currentIndex + 1}/{totalMatches}
              </span>
              <button
                onClick={onPrev}
                aria-label="Previous match"
                className="flex h-6 w-6 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={onNext}
                aria-label="Next match"
                className="flex h-6 w-6 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default TranscriptSearch;
