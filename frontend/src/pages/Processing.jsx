import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Brand from "../components/Brand";
import ErrorState from "../components/ErrorState";
import { useJobStatus } from "../hooks/useJobStatus";

const STAGES = [
  { key: "queued", label: "Queued" },
  { key: "processing", label: "Transcribing & summarizing" },
  { key: "done", label: "Ready" },
];

export default function Processing() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { status, error } = useJobStatus(jobId);

  useEffect(() => {
    if (status === "done") {
      navigate(`/result/${jobId}`, { replace: true });
    }
  }, [status, jobId, navigate]);

  if (status === "failed") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="mx-auto w-full max-w-5xl px-6 pt-8">
          <Brand />
        </header>
        <main className="flex flex-1 items-center justify-center px-6">
          <ErrorState
            title="The job didn't finish"
            message="Something interrupted processing on the backend. The video may be private, region-locked, or too long. Try a different link."
          />
        </main>
      </div>
    );
  }

  const stageIndex = Math.max(STAGES.findIndex((s) => s.key === status), 0);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto w-full max-w-5xl px-6 pt-8">
        <Brand />
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex items-end gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-2 rounded-full bg-violet animate-pulseBar"
              style={{ height: `${18 + (i % 3) * 10}px`, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold uppercase tracking-tight text-paper sm:text-4xl">
          {STAGES[stageIndex].label}
        </h1>
        <p className="mt-2 font-mono text-xs text-paper-muted">Job {jobId}</p>

        {error && <p className="mt-3 font-mono text-xs text-coral">Connection hiccup — still retrying in the background…</p>}

        <div className="mt-10 flex w-full gap-1.5">
          {STAGES.map((stage, i) => (
            <div key={stage.key} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${i <= stageIndex ? "bg-violet" : "bg-ink-border"}`} />
          ))}
        </div>

        <p className="mt-8 max-w-sm text-sm text-paper-muted">
          Whisper is doing a full pass on the audio before the summary is written — longer videos take a bit longer. This
          page updates on its own.
        </p>
      </main>
    </div>
  );
}
