import { useEffect, useRef, useState } from "react";
import { EXPORT_FORMATS } from "../services/exportService";

const ICONS = {
  pdf: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  docx: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  markdown: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15V9l3 3 3-3v6" />
      <path d="M17 15v-6l0 0" />
    </svg>
  ),
  text: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="8" y1="16" x2="13" y2="16" />
    </svg>
  ),
};

export default function ExportMenu({ result }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleExport(format) {
    setError(null);
    setPending(format.key);
    try {
      await format.run(result);
      setOpen(false);
    } catch (err) {
      setError(`Couldn't generate ${format.extension.toUpperCase()}. ${err.message || ""}`.trim());
    } finally {
      setPending(null);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-ink-border bg-ink-surface px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors duration-150 hover:border-violet/60 hover:text-violet"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-border bg-ink-surface shadow-xl shadow-black/40 animate-fadeUp"
        >
          <div className="border-b border-ink-border px-4 py-2.5">
            <span className="eyebrow">Export report</span>
          </div>
          <div className="p-1.5">
            {EXPORT_FORMATS.map((format) => (
              <button
                key={format.key}
                role="menuitem"
                onClick={() => handleExport(format)}
                disabled={pending !== null}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-paper transition-colors duration-150 hover:bg-ink-surface2 disabled:opacity-50"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-surface2 text-coral">
                  {ICONS[format.key]}
                </span>
                <span className="flex-1">{format.label}</span>
                {pending === format.key && (
                  <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-violet border-t-transparent" />
                )}
              </button>
            ))}
          </div>
          {error && (
            <p className="border-t border-ink-border px-4 py-2.5 font-mono text-[11px] text-danger">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
