import { memo } from "react";
import { BaseEdge, getBezierPath } from "reactflow";

function MindMapEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.35 });

  return (
    <>
      <defs>
        <linearGradient id={`mindmap-edge-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B7FFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF8B6B" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ ...style, stroke: `url(#mindmap-edge-gradient-${id})`, strokeWidth: 1.75 }} />
    </>
  );
}

export default memo(MindMapEdge);
