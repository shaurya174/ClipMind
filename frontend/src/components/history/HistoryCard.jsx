import { useState } from "react";
import { formatSummarizedDate } from "../../utils/relativeDate";

/**
 * A single history entry. The whole card is one clickable/keyboard-focusable
 * control — clicking (or pressing Enter/Space on it) starts a brand-new
 * summarization via onOpen, exactly like pasting the URL manually.
 */
export default function HistoryCard({ item, onOpen, isSubmitting }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open summary for ${item.title}`}
      aria-disabled={isSubmitting}
      className={`group flex items-center gap-4 rounded-2xl border border-ink-border bg-ink-surface p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet/40 hover:bg-ink-surface2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet ${
        isSubmitting ? "pointer-events-none opacity-60" : "cursor-pointer"
      }`}
    >
      <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded-xl bg-ink-surface2">
        {!thumbnailFailed && item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt=""
            loading="lazy"
            onError={() => setThumbnailFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-paper-muted">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
            </svg>
          </div>
        )}
        {isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet border-t-transparent" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-paper group-hover:text-white">
          {item.title}
        </p>
        <p className="mt-1 font-mono text-xs text-paper-muted">{formatSummarizedDate(item.summarized_at)}</p>
      </div>

      <div className="shrink-0 rounded-full bg-ink-surface2 px-2.5 py-1 font-mono text-xs text-paper-muted">
        {item.duration}
      </div>
    </div>
  );
}
