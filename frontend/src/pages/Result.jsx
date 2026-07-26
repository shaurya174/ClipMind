import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Brand from "../components/Brand";
import ChunkAccordion from "../components/ChunkAccordion";
import ErrorState from "../components/ErrorState";
import ExportMenu from "../components/ExportMenu";
import TimelineStrip from "../components/TimelineStrip";
import UserMenu from "../components/auth/UserMenu";
import ChatAvatarButton from "../components/chat/ChatAvatarButton";
import ChatWindow from "../components/chat/ChatWindow";
import { useChat } from "../hooks/useChat";
import { getJobResult } from "../services/api";
import { timeToSeconds } from "../utils/time";

function LoadingResult() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex gap-1.5">
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
      </div>
      <p className="font-mono text-xs text-paper-muted">Loading summary…</p>
    </div>
  );
}

export default function Result() {
  const { jobId } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeChunk, setActiveChunk] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);

  const initialSeekLabel = location.state?.seekTimestamp || null;
  const [seekSeconds, setSeekSeconds] = useState(() => (initialSeekLabel ? timeToSeconds(initialSeekLabel) : null));

  const chunkRefs = useRef([]);
  const videoSectionRef = useRef(null);

  const { messages, isThinking, retryMessage, sendMessage } = useChat(result?.video_id);

  useEffect(() => {
    let cancelled = false;
    getJobResult(jobId)
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  useEffect(() => {
    if (result && initialSeekLabel) {
      videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  function scrollToChunk(index) {
    setActiveChunk(index);
    chunkRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleSeek(startTimeLabel) {
    setSeekSeconds(timeToSeconds(startTimeLabel));
    videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-5xl px-6 pt-8">
          <Brand />
        </header>
        <main className="flex flex-1 items-center justify-center px-6">
          <ErrorState title="Couldn't load this summary" message={error} actionLabel="Try another video" />
        </main>
      </div>
    );
  }

  if (!result) return <LoadingResult />;

  const { title, duration, video_id, summary } = result;
  const chunks = summary?.chunk_summaries || [];
  const takeaways = summary?.key_takeaways || [];
  const embedSrc = `https://www.youtube.com/embed/${video_id}?rel=0${seekSeconds != null ? `&start=${seekSeconds}` : ""}`;

  return (
    <div className="min-h-screen pb-24">
      <header className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-y-3 px-6 pt-8">
        <Brand />
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            to={`/transcript/${video_id}`}
            state={{ jobId }}
            className="flex items-center gap-2 rounded-full border border-ink-border bg-ink-surface px-4 py-2 font-mono text-xs uppercase tracking-wide text-paper transition-colors duration-150 hover:border-violet/60 hover:text-violet"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h10" />
            </svg>
            Transcript
          </Link>
          <ExportMenu result={result} />
          <Link to="/" className="font-mono text-xs uppercase tracking-wide text-paper-muted hover:text-paper">
            + New summary
          </Link>
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-8 px-6">
        <section ref={videoSectionRef} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-ink-border bg-black">
              <iframe
                className="h-full w-full"
                src={embedSrc}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3 lg:col-span-2">
            <span className="eyebrow">Now summarized</span>
            <h1 className="font-display text-2xl font-bold leading-tight text-paper sm:text-3xl">{title}</h1>
            <div className="flex items-center gap-2 font-mono text-xs text-paper-muted">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {duration}
            </div>
          </div>
        </section>

        <section className="card relative flex flex-col items-start gap-4 overflow-hidden p-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 0% 0%, rgba(139,127,255,0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,139,107,0.14), transparent 55%)",
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet/15 text-violet">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="2.5" />
                <circle cx="5" cy="19" r="2.5" />
                <circle cx="19" cy="19" r="2.5" />
                <path d="M12 7.5v5m0 0-5 4m5-4 5 4" />
              </svg>
            </div>
            <div>
              <span className="eyebrow">Flagship feature</span>
              <h2 className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-paper">Explore this video as a mind map</h2>
              <p className="mt-1 max-w-md text-sm text-paper-muted">
                See every concept the video covers, how they connect, and jump straight to the moment each one is explained.
              </p>
            </div>
          </div>
          <Link to={`/mindmap/${video_id}`} state={{ jobId, videoTitle: title, duration }} className="btn-primary relative shrink-0">
            Explore Concepts
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </section>

        {chunks.length > 0 && (
          <section className="card p-5">
            <TimelineStrip chunks={chunks} activeIndex={activeChunk} onSelect={scrollToChunk} />
          </section>
        )}

        <section className="card p-6">
          <span className="eyebrow">Overall summary</span>
          <p className="mt-3 text-base leading-relaxed text-paper/95">{summary?.overall_summary}</p>
        </section>

        {takeaways.length > 0 && (
          <section>
            <span className="eyebrow">Key takeaways</span>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {takeaways.map((point, i) => (
                <div key={i} className="card flex gap-3 p-4">
                  <span className="mt-0.5 font-mono text-xs text-coral">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-paper/90">{point}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {chunks.length > 0 && (
          <section>
            <span className="eyebrow">Chapter breakdown</span>
            <div className="mt-3 flex flex-col gap-4">
              {chunks.map((chunk, i) => (
                <ChunkAccordion
                  key={i}
                  ref={(el) => (chunkRefs.current[i] = el)}
                  chunk={chunk}
                  index={i}
                  isActive={activeChunk === i}
                  onClick={() => setActiveChunk(i)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <ChatAvatarButton onClick={() => setChatOpen(true)} />
      <ChatWindow
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        videoTitle={title}
        videoId={video_id}
        messages={messages}
        isThinking={isThinking}
        onSend={sendMessage}
        onRetry={retryMessage}
        onSeek={handleSeek}
      />
    </div>
  );
}
