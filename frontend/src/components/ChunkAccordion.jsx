import { forwardRef, useState } from "react";

const ACCENTS = ["border-l-violet", "border-l-coral", "border-l-teal"];

const ChunkAccordion = forwardRef(function ChunkAccordion({ chunk, index, isActive, onClick }, ref) {
  const [open, setOpen] = useState(false);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`card border-l-4 ${ACCENTS[index % ACCENTS.length]} p-5 transition-all duration-200 ${
        isActive ? "ring-1 ring-violet/50" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="font-mono text-xs text-paper-muted">
            {chunk.start_time} → {chunk.end_time}
          </span>
          <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-paper">
            {chunk.title}
          </h3>
        </div>
        <span className="rounded-full bg-ink-surface2 px-3 py-1 font-mono text-xs text-paper-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-paper/90">{chunk.summary}</p>

      {chunk.key_points && chunk.key_points.length > 0 && (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-violet hover:text-white"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {open ? "Hide key points" : `Show key points (${chunk.key_points.length})`}
          </button>

          {open && (
            <ul className="mt-3 space-y-2 border-t border-ink-border pt-3 animate-fadeUp">
              {chunk.key_points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-paper-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
});

export default ChunkAccordion;
