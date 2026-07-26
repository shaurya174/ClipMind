import dagre from "dagre";

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 76;

export function buildMindMapGraph(data) {
  const rawNodes = data?.nodes || [];
  const rootRawNode = rawNodes.find((n) => n.parent === null || n.parent === undefined);
  const rootId = rootRawNode?.id ?? rawNodes[0]?.id ?? null;

  const nodes = rawNodes.map((n) => ({
    id: n.id,
    type: "conceptNode",
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
    data: {
      label: n.title,
      isRoot: n.id === rootId,
      detail: n.details || null,
    },
    position: { x: 0, y: 0 },
  }));

  const edges = rawNodes
    .filter((n) => n.parent !== null && n.parent !== undefined && n.id !== rootId)
    .map((n) => ({
      id: `edge-${n.parent}-${n.id}`,
      source: n.parent,
      target: n.id,
      type: "conceptEdge",
      animated: true,
    }));

  return { nodes: layoutWithDagre(nodes, edges), edges, rootId };
}

function layoutWithDagre(nodes, edges) {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "LR", nodesep: 56, ranksep: 140, marginx: 40, marginy: 40 });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });
  edges.forEach((edge) => {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
      graph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(graph);

  return nodes.map((node) => {
    const pos = graph.node(node.id);
    return {
      ...node,
      position: pos ? { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 } : { x: 0, y: 0 },
    };
  });
}
