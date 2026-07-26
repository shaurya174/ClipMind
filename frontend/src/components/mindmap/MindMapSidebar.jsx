import { motion } from "framer-motion";

export default function MindMapSidebar({ node, onClose, onSeek }) {
  const label = node.data.label;
  const detail = node.data.detail || {};
  const timestamp = node.data.timestamp;

  const hasAnyDetail =
    detail.what_is_it || detail.role_in_video || detail.how_it_is_used || detail.why_it_matters ||
    (detail.related_concepts && detail.related_concepts.length > 0);

  return (
    <motion.div
      initial={{ x: "100%", y: 0, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ x: "100%", y: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      className="themed-scroll fixed inset-x-0 bottom-0 z-30 max-h-[75vh] overflow-y-auto rounded-t-3xl border-t border-ink-border bg-ink-surface shadow-2xl shadow-black/50 sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:top-0 sm:h-full sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:rounded-l-3xl sm:border-l sm:border-t-0"
    >
      <div className="flex items-start justify-between gap-4 border-b border-ink-border px-6 py-5">
        <div className="min-w-0">
          <span className="eyebrow">{node.data.isRoot ? "Central topic" : "Concept"}</span>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight text-paper">{label}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-6 px-6 py-6">
        {timestamp && (
          <button
            onClick={() => onSeek(timestamp.start_time)}
            className="flex w-fit items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-4 py-2 font-mono text-sm text-coral transition-colors duration-150 hover:bg-coral/20"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            {timestamp.start_time} — {timestamp.end_time}
          </button>
        )}

        {detail.what_is_it && (
          <section>
            <span className="eyebrow">What it is</span>
            <p className="mt-2 text-sm leading-relaxed text-paper/90">{detail.what_is_it}</p>
          </section>
        )}
        {detail.role_in_video && (
          <section className="card p-4">
            <span className="eyebrow">Role in this video</span>
            <p className="mt-2 text-sm leading-relaxed text-paper/90">{detail.role_in_video}</p>
          </section>
        )}
        {detail.how_it_is_used && (
          <section>
            <span className="eyebrow">How it's used</span>
            <p className="mt-2 text-sm leading-relaxed text-paper/90">{detail.how_it_is_used}</p>
          </section>
        )}
        {detail.why_it_matters && (
          <section className="card p-4">
            <span className="eyebrow">Why it matters</span>
            <p className="mt-2 text-sm leading-relaxed text-paper/90">{detail.why_it_matters}</p>
          </section>
        )}
        {detail.related_concepts && detail.related_concepts.length > 0 && (
          <section>
            <span className="eyebrow">Related concepts</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {detail.related_concepts.map((concept, i) => (
                <span key={i} className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1.5 text-xs text-violet">
                  {concept}
                </span>
              ))}
            </div>
          </section>
        )}

        {!hasAnyDetail && (
          <p className="text-sm text-paper-muted">
            {node.data.isRoot ? "This is the central topic the rest of the map branches from." : "No further detail was generated for this concept."}
          </p>
        )}
      </div>
    </motion.div>
  );
}
