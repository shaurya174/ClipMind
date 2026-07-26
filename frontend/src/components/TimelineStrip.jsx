import { timeToSeconds } from "../utils/time";

const SEGMENT_COLORS = ["bg-violet", "bg-coral", "bg-teal"];

export default function TimelineStrip({ chunks, activeIndex, onSelect }) {
  if (!chunks || chunks.length === 0) return null;

  const withDurations = chunks.map((chunk) => {
    const start = timeToSeconds(chunk.start_time);
    const end = timeToSeconds(chunk.end_time);
    return { ...chunk, duration: Math.max(end - start, 1) };
  });
  const total = withDurations.reduce((sum, c) => sum + c.duration, 0) || 1;

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="eyebrow">Timeline · {chunks.length} segments</span>
        <span className="eyebrow hidden sm:inline">Tap a segment to jump</span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full border border-ink-border">
        {withDurations.map((chunk, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            title={`${chunk.start_time} – ${chunk.end_time} · ${chunk.title}`}
            style={{ width: `${(chunk.duration / total) * 100}%` }}
            className={`group relative h-full transition-opacity duration-150 ${SEGMENT_COLORS[i % SEGMENT_COLORS.length]} ${
              activeIndex === i ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-ink" />
          </button>
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[11px] text-paper-muted">
        <span>{chunks[0].start_time}</span>
        <span>{chunks[chunks.length - 1].end_time}</span>
      </div>
    </div>
  );
}
