import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Brand from "../components/Brand";
import UserMenu from "../components/auth/UserMenu";
import ReviewSection from "../components/reviews/ReviewSection";
import { createSummaryJob } from "../services/api";

const YOUTUBE_URL_PATTERN = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/i;

export default function Home() {
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Paste a YouTube link to get started.");
      return;
    }
    if (!YOUTUBE_URL_PATTERN.test(trimmed)) {
      setError("That doesn't look like a YouTube URL. Try youtube.com/watch?v=… or youtu.be/…");
      return;
    }

    setSubmitting(true);
    try {
      const { job_id } = await createSummaryJob(trimmed);
      navigate(`/processing/${job_id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 pt-8">
        <Brand />
        <UserMenu />
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="eyebrow mb-4">Paste. Process. Understand.</span>
        <h1 className="font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl md:text-7xl">
          Turn any video
          <br />
          into a <span className="text-violet">reading</span>
        </h1>
        <p className="mt-6 max-w-lg text-base text-paper-muted">
          Drop in a YouTube link. ClipMind watches it end to end and hands you back a chaptered summary — no scrubbing, no
          skipping ahead to guess.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xl">
          <div className="flex flex-col gap-3 rounded-2xl border border-ink-border bg-ink-surface p-2 sm:flex-row">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
              className="flex-1 bg-transparent px-4 py-3 font-mono text-sm text-paper placeholder:text-paper-muted/60 focus:outline-none"
              disabled={submitting}
              autoFocus
            />
            <button type="submit" className="btn-primary shrink-0" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-ink" />
                  Starting…
                </>
              ) : (
                <>
                  Summarize
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-left font-mono text-xs text-danger animate-fadeUp">{error}</p>}
        </form>

        <div className="mt-14 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Overall summary", desc: "The whole video, distilled to a paragraph." },
            { label: "Key takeaways", desc: "The points worth remembering." },
            { label: "Chunk breakdown", desc: "Timestamped, chapter by chapter." },
          ].map((f) => (
            <div key={f.label} className="card p-4 text-left">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-coral">{f.label}</p>
              <p className="mt-1 text-xs text-paper-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <ReviewSection />
    </div>
  );
}
