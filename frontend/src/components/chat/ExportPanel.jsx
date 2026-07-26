import { useState } from "react";
import { CHAT_EXPORT_FORMATS } from "../../services/exportService";

export default function ExportPanel({ videoTitle, videoId, messages }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  const hasContent = messages.some((m) => !m.failed && m.role === "assistant");

  async function handleExport(format) {
    setError(null);
    setPending(format.key);
    try {
      await format.run({ videoTitle, videoId, messages });
      setOpen(false);
    } catch (err) {
      setError(`Couldn't generate ${format.extension.toUpperCase()}.`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!hasContent}
        title={hasContent ? "Export this conversation" : "Ask a question first"}
        className="flex items-center gap-1.5 rounded-full border border-ink-border bg-ink px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-paper-muted transition-colors duration-150 hover:border-violet/60 hover:text-violet disabled:opacity-30 disabled:pointer-events-none"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export chat
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-48 overflow-hidden rounded-xl border border-ink-border bg-ink-surface shadow-xl shadow-black/40 animate-fadeUp">
          <div className="p-1.5">
            {CHAT_EXPORT_FORMATS.map((format) => (
              <button
                key={format.key}
                onClick={() => handleExport(format)}
                disabled={pending !== null}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-paper transition-colors duration-150 hover:bg-ink-surface2 disabled:opacity-50"
              >
                {format.label}
                {pending === format.key && (
                  <span className="h-2.5 w-2.5 shrink-0 animate-spin rounded-full border-2 border-violet border-t-transparent" />
                )}
              </button>
            ))}
          </div>
          {error && <p className="border-t border-ink-border px-3 py-2 font-mono text-[10px] text-danger">{error}</p>}
        </div>
      )}
    </div>
  );
}
