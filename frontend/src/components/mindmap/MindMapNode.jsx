import { memo } from "react";
import { Handle, Position } from "reactflow";

function MindMapNode({ data, selected }) {
  const { label, isRoot, timestamp, dimmed, matched } = data;

  return (
    <div
      className={`group relative flex min-w-[200px] max-w-[240px] flex-col gap-1.5 rounded-2xl border px-4 py-3 shadow-md transition-all duration-200 ${
        isRoot ? "border-violet bg-violet text-ink shadow-violet/30" : "border-ink-border bg-ink-surface2 text-paper shadow-black/20"
      } ${selected ? "ring-2 ring-violet ring-offset-2 ring-offset-ink scale-[1.03]" : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet/10"} ${
        dimmed ? "opacity-25" : "opacity-100"
      } ${matched ? "ring-2 ring-coral" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-violet !border-none !h-2 !w-2" />
      <Handle type="source" position={Position.Right} className="!bg-violet !border-none !h-2 !w-2" />

      <span className={`font-display text-sm font-bold leading-tight tracking-tight ${isRoot ? "uppercase" : ""}`}>{label}</span>

      {timestamp && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-coral/15 px-2 py-0.5 font-mono text-[10px] text-coral">
          {timestamp.start_time} – {timestamp.end_time}
        </span>
      )}

      {isRoot && <span className="font-mono text-[10px] uppercase tracking-wide text-ink/70">Central topic</span>}
    </div>
  );
}

export default memo(MindMapNode);
