import { useState } from "react";
import { toPng } from "html-to-image";
import { exportMindMapPdf } from "../../services/mindmapExportService";

export default function ExportMindMapButton({ canvasRef, videoTitle, duration, data }) {
  const [status, setStatus] = useState("idle");

  async function handleExport() {
    setStatus("rendering");
    let imageDataUrl = null;

    try {
      if (canvasRef.current) {
        imageDataUrl = await toPng(canvasRef.current, {
          backgroundColor: "#14131A",
          pixelRatio: 2,
          filter: (node) => !node.classList?.contains("react-flow__minimap"),
        });
      }
    } catch {
      imageDataUrl = null;
    }

    try {
      exportMindMapPdf({ videoTitle, duration, data, imageDataUrl });
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={status === "rendering"}
      className="flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 font-body text-sm font-semibold text-ink shadow-md shadow-coral/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white disabled:opacity-50 disabled:pointer-events-none"
    >
      {status === "rendering" ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
          Generating…
        </>
      ) : status === "done" ? (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Saved
        </>
      ) : status === "error" ? (
        "Couldn't export"
      ) : (
        <>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Mind Map
        </>
      )}
    </button>
  );
}
