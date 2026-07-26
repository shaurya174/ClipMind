import { useReactFlow } from "reactflow";
import ExportMindMapButton from "./ExportMindMapButton";
import SearchBar from "./SearchBar";

export default function MindMapToolbar({ searchTerm, onSearchChange, rootPosition, canvasRef, videoTitle, duration, data }) {
  const { fitView, zoomTo, setCenter } = useReactFlow();

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-10 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
      <div className="pointer-events-auto flex flex-wrap items-center gap-2">
        <SearchBar value={searchTerm} onChange={onSearchChange} />

        <div className="flex items-center gap-1 rounded-full border border-ink-border bg-ink-surface p-1">
          <button
            onClick={() => fitView({ padding: 0.3, duration: 400 })}
            title="Fit to screen"
            className="flex h-8 w-8 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (rootPosition) setCenter(rootPosition.x, rootPosition.y, { zoom: 1, duration: 400 });
              else fitView({ padding: 0.3, duration: 400 });
            }}
            title="Center graph"
            className="flex h-8 w-8 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
            </svg>
          </button>
          <button
            onClick={() => zoomTo(1, { duration: 400 })}
            title="Reset zoom"
            className="flex h-8 w-8 items-center justify-center rounded-full text-paper-muted transition-colors duration-150 hover:bg-ink-surface2 hover:text-paper"
          >
            <span className="font-mono text-[11px] font-bold">1:1</span>
          </button>
        </div>
      </div>

      <div className="pointer-events-auto">
        <ExportMindMapButton canvasRef={canvasRef} videoTitle={videoTitle} duration={duration} data={data} />
      </div>
    </div>
  );
}
