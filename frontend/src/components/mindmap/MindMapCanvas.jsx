import { forwardRef, useMemo } from "react";
import ReactFlow, { Background, BackgroundVariant, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import MindMapEdge from "./MindMapEdge";
import MindMapNode from "./MindMapNode";

const nodeTypes = { conceptNode: MindMapNode };
const edgeTypes = { conceptEdge: MindMapEdge };

const MindMapCanvas = forwardRef(function MindMapCanvas({ nodes, edges, activeNodeId, searchTerm, onNodeClick, onPaneClick }, ref) {
  const styledNodes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const isSearching = term.length > 0;

    return nodes.map((node) => {
      const matched = isSearching && node.data.label.toLowerCase().includes(term);
      return {
        ...node,
        selected: node.id === activeNodeId,
        data: { ...node.data, dimmed: isSearching && !matched, matched },
      };
    });
  }, [nodes, activeNodeId, searchTerm]);

  return (
    <div ref={ref} className="h-full w-full">
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={(_, node) => onNodeClick(node.id)}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        className="bg-transparent"
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1.5} color="#2C2A38" />
        <Controls
          className="!rounded-xl !border !border-ink-border !bg-ink-surface !shadow-lg [&>button]:!border-ink-border [&>button]:!bg-ink-surface [&>button]:!fill-paper [&>button]:!text-paper [&>button:hover]:!bg-ink-surface2"
          showInteractive={false}
        />
        <MiniMap
          className="!rounded-xl !border !border-ink-border !bg-ink-surface"
          maskColor="rgba(20, 19, 26, 0.75)"
          nodeColor={(n) => (n.data?.isRoot ? "#8B7FFF" : "#FF8B6B")}
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
});

export default MindMapCanvas;
