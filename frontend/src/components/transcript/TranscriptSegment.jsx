import { forwardRef, memo } from "react";
import { splitByMatch } from "../../utils/highlight";

const TranscriptSegment = forwardRef(function TranscriptSegment({ segment, searchTerm, isActiveMatch, onTimestampClick }, ref) {
  const fragments = splitByMatch(segment.text, searchTerm);

  return (
    <div
      ref={ref}
      className={`group flex gap-4 rounded-2xl border p-4 transition-all duration-200 ${
        isActiveMatch ? "border-violet/60 bg-violet/10" : "border-ink-border bg-ink-surface hover:border-ink-border hover:bg-ink-surface2"
      }`}
    >
      <button
        onClick={() => onTimestampClick(segment.start)}
        className="flex h-fit shrink-0 items-center gap-1 rounded-full border border-coral/40 bg-coral/10 px-3 py-1.5 font-mono text-xs text-coral transition-colors duration-150 hover:bg-coral/20"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        {segment.start_time}
      </button>

      <p className="text-sm leading-relaxed text-paper/90">
        {fragments.map((fragment, i) =>
          fragment.isMatch ? (
            <mark key={i} className="rounded px-0.5 text-paper no-underline" style={{ backgroundColor: "rgba(139, 127, 255, 0.35)" }}>
              {fragment.text}
            </mark>
          ) : (
            <span key={i}>{fragment.text}</span>
          )
        )}
      </p>
    </div>
  );
});

export default memo(TranscriptSegment);
