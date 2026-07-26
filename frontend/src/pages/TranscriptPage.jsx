import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TranscriptHeader from "../components/transcript/TranscriptHeader";
import TranscriptViewer from "../components/transcript/TranscriptViewer";
import ErrorState from "../components/ErrorState";
import { getTranscript } from "../services/api";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";
import { timeToSeconds } from "../utils/time";

export default function TranscriptPage() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const jobId = location.state?.jobId;
  const playerContainerRef = useRef(null);

  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [retryToken, setRetryToken] = useState(0);

  const { seekTo } = useYouTubePlayer(playerContainerRef, loadState === "ready" ? videoId : null);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setErrorMessage(null);

    getTranscript(videoId)
      .then((res) => {
        if (cancelled) return;
        if (!res || !res.segments || res.segments.length === 0) {
          setData(res || null);
          setLoadState("empty");
          return;
        }
        setData(res);
        setLoadState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMessage(err.message);
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [videoId, retryToken]);

  function handleBack() {
    if (jobId) navigate(`/result/${jobId}`);
    else navigate(-1);
  }

  function handleTimestampClick(startTimeLabel) {
    seekTo(startTimeLabel);
  }

  const videoTitle = data?.title;
  const duration = data?.duration;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TranscriptHeader videoTitle={videoTitle} duration={duration} onBack={handleBack} />

      <div className="themed-scroll min-h-0 flex-1 overflow-y-auto lg:flex lg:overflow-hidden">
        {loadState === "loading" && (
          <div className="flex flex-1 items-center justify-center p-6 lg:h-full">
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
              </div>
              <p className="font-mono text-xs text-paper-muted">Loading transcript…</p>
            </div>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 lg:h-full">
            <ErrorState
              title="Couldn't load the transcript"
              message={errorMessage}
              actionLabel={jobId ? "Back to summary" : "Back to home"}
              actionTo={jobId ? `/result/${jobId}` : "/"}
            />
            <button onClick={() => setRetryToken((t) => t + 1)} className="btn-primary">
              Retry
            </button>
          </div>
        )}

        {loadState === "empty" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center lg:h-full">
            <span className="eyebrow">No transcript available</span>
            <p className="max-w-sm text-sm text-paper-muted">
              ClipMind doesn't have a transcript for this video yet. Try again once processing has fully settled.
            </p>
            <button onClick={() => setRetryToken((t) => t + 1)} className="btn-primary mt-2">
              Retry
            </button>
          </div>
        )}

        <div
          className={`border-b border-ink-border p-4 sm:p-6 lg:h-full lg:w-[56%] lg:overflow-y-auto lg:border-b-0 lg:border-r ${
            loadState === "ready" ? "" : "hidden"
          }`}
        >
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-ink-border bg-black">
              <div ref={playerContainerRef} className="h-full w-full" />
            </div>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-paper-muted">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Click any timestamp in the transcript to jump the player here.
            </p>
          </div>
        </div>

        {loadState === "ready" && data && (
          <div className="lg:h-full lg:w-[44%]">
            <TranscriptViewer segments={data.segments} onTimestampClick={handleTimestampClick} />
          </div>
        )}
      </div>
    </div>
  );
}
