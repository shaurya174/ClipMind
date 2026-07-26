import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const MIN_LENGTH = 5;
const MAX_LENGTH = 1000;

/**
 * Standalone modal for writing/editing a review — never embedded inline
 * on the page. Pre-fills from `existingReview` when editing.
 */
export default function ReviewModal({ open, existingReview, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setRating(existingReview?.rating || 0);
      setText(existingReview?.review || "");
      setError(null);
    }
  }, [open, existingReview]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose, submitting]);

  if (!open) return null;

  const trimmedLength = text.trim().length;
  const isValid = rating >= 1 && rating <= 5 && trimmedLength >= MIN_LENGTH && text.length <= MAX_LENGTH;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Pick a star rating first.");
      return;
    }
    if (trimmedLength < MIN_LENGTH) {
      setError(`Reviews need at least ${MIN_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ rating, review: text.trim() });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        onClick={() => !submitting && onClose()}
        className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm animate-fadeUp"
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={existingReview ? "Edit your review" : "Write a review"}
          className="w-full max-w-md rounded-t-3xl border border-ink-border bg-ink-surface p-6 shadow-2xl shadow-black/50 animate-fadeUp sm:rounded-3xl sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="eyebrow">{existingReview ? "Edit review" : "Share your experience"}</span>
              <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-paper">
                {existingReview ? "Edit your review" : "Write a review"}
              </h2>
            </div>
            <button
              onClick={() => !submitting && onClose()}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs uppercase tracking-wide text-paper-muted">Your rating</label>
              <StarRating value={rating} onChange={setRating} size={26} />
            </div>

            <div>
              <label className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-paper-muted">Your review</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                rows={4}
                autoFocus
                placeholder="What was your experience with ClipMind like?"
                className="w-full resize-none rounded-xl border border-ink-border bg-ink px-4 py-3 text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none focus:border-violet/60"
              />
              <div className="mt-1.5 flex justify-end">
                <span className="font-mono text-[11px] text-paper-muted">{text.length}/{MAX_LENGTH}</span>
              </div>
            </div>

            {error && <p className="font-mono text-xs text-danger animate-fadeUp">{error}</p>}

            <div className="mt-1 flex gap-3">
              <button
                type="button"
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                className="flex-1 rounded-full border border-ink-border px-5 py-3 text-sm font-semibold text-paper-muted transition-colors duration-150 hover:text-paper disabled:opacity-50"
              >
                Cancel
              </button>
              <button type="submit" disabled={submitting || !isValid} className="btn-primary flex-1">
                {submitting ? "Saving…" : existingReview ? "Save changes" : "Submit review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
