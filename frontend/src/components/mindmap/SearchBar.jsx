export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-ink-border bg-ink-surface px-3.5 py-2">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-paper-muted">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search concepts…"
        className="w-32 bg-transparent text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none sm:w-44"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear search" className="text-paper-muted hover:text-paper">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
