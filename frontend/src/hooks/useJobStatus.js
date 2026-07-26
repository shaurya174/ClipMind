import { useEffect, useRef, useState } from "react";
import { getJobStatus } from "../services/api";

const POLL_INTERVAL_MS = 2500;

export function useJobStatus(jobId) {
  const [status, setStatus] = useState("queued");
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!jobId) return undefined;
    cancelledRef.current = false;

    async function poll() {
      try {
        const data = await getJobStatus(jobId);
        if (cancelledRef.current) return;
        setStatus(data.status);
        setError(null);
        if (data.status !== "done" && data.status !== "failed") {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (cancelledRef.current) return;
        setError(err.message);
        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [jobId]);

  return { status, error };
}
