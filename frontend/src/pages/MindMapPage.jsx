import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ReactFlowProvider } from "reactflow";
import MindMapCanvas from "../components/mindmap/MindMapCanvas";
import MindMapHeader from "../components/mindmap/MindMapHeader";
import MindMapSidebar from "../components/mindmap/MindMapSidebar";
import MindMapToolbar from "../components/mindmap/MindMapToolbar";
import ErrorState from "../components/ErrorState";
import { getMindMap } from "../services/api";
import { buildMindMapGraph } from "../utils/mindmapLayout";

function MindMapSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet [animation-delay:300ms]" />
        </div>
        <p className="font-mono text-xs text-paper-muted">Mapping concepts…</p>
      </div>
    </div>
  );
}

export default function MindMapPage() {
  const { videoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const jobId = location.state?.jobId;
  const videoTitle = location.state?.videoTitle;
  const duration = location.state?.duration;

  const [data, setData] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [errorMessage, setErrorMessage] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");
    setErrorMessage(null);

    getMindMap(videoId)
      .then((res) => {
        if (cancelled) return;
        if (!res || !res.nodes || res.nodes.length === 0) {
          setLoadState("empty");
          setData(res || null);
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

  const graph = useMemo(() => (data ? buildMindMapGraph(data) : null), [data]);

  const activeNode = useMemo(() => {
    if (!graph || !activeNodeId) return null;
    return graph.nodes.find((n) => n.id === activeNodeId) || null;
  }, [graph, activeNodeId]);

  const rootPosition = graph?.nodes.find((n) => n.id === graph.rootId)?.position || null;

  function handleBack() {
    if (jobId) navigate(`/result/${jobId}`);
    else navigate(-1);
  }

  function handleSeek(startTimeLabel) {
    if (jobId) {
      navigate(`/result/${jobId}`, { state: { seekTimestamp: startTimeLabel } });
    } else {
      const parts = startTimeLabel.split(":").map(Number);
      const seconds = parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0] * 3600 + parts[1] * 60 + parts[2];
      window.open(`https://www.youtube.com/watch?v=${videoId}&t=${seconds}s`, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <MindMapHeader videoTitle={videoTitle} duration={duration} onBack={handleBack} />

      <div className="relative flex-1 overflow-hidden">
        {loadState === "loading" && <MindMapSkeleton />}

        {loadState === "error" && (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
            <ErrorState
              title="Couldn't load the mind map"
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
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="eyebrow">No concepts found</span>
            <p className="max-w-sm text-sm text-paper-muted">
              ClipMind couldn't extract a concept graph for this video yet. Try again once processing has fully settled.
            </p>
            <button onClick={() => setRetryToken((t) => t + 1)} className="btn-primary mt-2">
              Retry
            </button>
          </div>
        )}

        {loadState === "ready" && graph && (
          <ReactFlowProvider>
            <MindMapToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              rootPosition={rootPosition}
              canvasRef={canvasRef}
              videoTitle={videoTitle}
              duration={duration}
              data={data}
            />
            <MindMapCanvas
              ref={canvasRef}
              nodes={graph.nodes}
              edges={graph.edges}
              activeNodeId={activeNodeId}
              searchTerm={searchTerm}
              onNodeClick={(id) => setActiveNodeId(id)}
              onPaneClick={() => setActiveNodeId(null)}
            />
          </ReactFlowProvider>
        )}

        <AnimatePresence>
          {activeNode && (
            <MindMapSidebar key={activeNode.id} node={activeNode} onClose={() => setActiveNodeId(null)} onSeek={handleSeek} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
