import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSummaryJob, getSummaryHistory } from "../../services/api";
import HistoryCard from "./HistoryCard";

function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-ink-border bg-ink-surface p-3">
          <div className="shimmer-bg h-[68px] w-[120px] shrink-0 animate-shimmer rounded-xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="shimmer-bg h-3 w-3/4 animate-shimmer rounded" />
            <div className="shimmer-bg h-2.5 w-1/3 animate-shimmer rounded" />
          </div>
          <div className="shimmer-bg h-5 w-10 shrink-0 animate-shimmer rounded-full" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-border bg-ink-surface px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet/15 text-violet">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <p className="font-display text-sm font-bold uppercase tracking-tight text-paper">No summaries yet</p>
      <p className="max-w-xs text-sm text-paper-muted">Start summarizing YouTube videos to build your history.</p>
    </div>
  );
}

/**
 * Sits directly below the Account section on the profile page. Every card
 * click starts a completely new summarization (POST /summarize) and drops
 * the user into the existing Processing → Result flow — never reopens an
 * old result. Duplicate entries for the same video are expected and never
 * deduplicated.
 */
export default function RecentSummariesSection() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loadState, setLoadState] = useState("loading"); // loading | error | ready
  const [errorMessage, setErrorMessage] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // async function loadHistory() {
  //   setLoadState("loading");
  //   setErrorMessage(null);
  //   try {
  //     const res = await getSummaryHistory();
  //     setItems(res?.items || []);
  //     setLoadState("ready");
  //   } catch (err) {
  //     setErrorMessage(err.message);
  //     setLoadState("error");
  //   }
  // }
  async function loadHistory() {
  console.log("Loading summary history...");

  setLoadState("loading");
  setErrorMessage(null);

  try {
    const res = await getSummaryHistory();

    console.log("History response:", res);

    setItems(res?.items || []);
    setLoadState("ready");
  } catch (err) {
    console.error("History error:", err);
    console.error("History error message:", err.message);

    setErrorMessage(err.message);
    setLoadState("error");
  }
}

  useEffect(() => {
    loadHistory();
  }, []);

  async function handleOpen(item) {
    if (submittingId) return;
    setSubmitError(null);
    setSubmittingId(item.youtube_video_id + item.summarized_at);
    try {
      const url = `https://www.youtube.com/watch?v=${item.youtube_video_id}`;
      const { job_id } = await createSummaryJob(url);
      navigate(`/processing/${job_id}`);
    } catch (err) {
      setSubmitError(err.message);
      setSubmittingId(null);
    }
  }

  return (
    <div className="mt-10">
      <span className="eyebrow">Pick up where you left off</span>
      <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-tight text-paper">Recent Summaries</h2>

      <div className="mt-4">
        {loadState === "loading" && <HistorySkeleton />}

        {loadState === "error" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger/30 bg-danger/5 px-6 py-10 text-center">
            <p className="text-sm text-danger">Unable to load recent summaries.</p>
            <button onClick={loadHistory} className="btn-primary">
              Retry
            </button>
          </div>
        )}

        {loadState === "ready" && items.length === 0 && <EmptyState />}

        {loadState === "ready" && items.length > 0 && (
          <div className="flex flex-col gap-3">
            {items.map((item, i) => {
              const key = item.youtube_video_id + item.summarized_at + i;
              return (
                <HistoryCard
                  key={key}
                  item={item}
                  onOpen={() => handleOpen(item)}
                  isSubmitting={submittingId === item.youtube_video_id + item.summarized_at}
                />
              );
            })}
          </div>
        )}

        {submitError && <p className="mt-3 font-mono text-xs text-danger animate-fadeUp">{submitError}</p>}
      </div>
    </div>
  );
}
