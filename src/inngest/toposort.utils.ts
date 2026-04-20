import toposort from "toposort";
import { NodeType, ConnectionType } from "@/db/schema/workflows";

//  For sorting the nodes in an DAG manner
//  We need to also prevent cyclic nodes

export const topologicalSort = (
  nodes: NodeType[],
  connections: ConnectionType[],
): NodeType[] => {
  // if no connections, then nodes are independent, so return them as it is
  if (connections.length === 0) {
    return nodes;
  }

  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // add the nodes with no connections

  const connectedNodesIds = new Set<string>();
  connections.forEach((connection) => {
    connectedNodesIds.add(connection.fromNodeId);
    connectedNodesIds.add(connection.toNodeId);
  });

  const nodesWithNoConnections = nodes.filter((node) => {
    // nodes with no connections as self edges
    return !connectedNodesIds.has(node.id);
  });

  const graph = [
    ...edges,
    ...nodesWithNoConnections.map((node) => [node.id, undefined]),
  ];

  let sortedNodeIds: string[] = [];
  try {
    //  NOTE: Learn how the toposort do the sorting
    sortedNodeIds = toposort(graph as [string, string | undefined][]);
    // remove duplicates and undefined values
    sortedNodeIds = [...new Set(sortedNodeIds)].filter(Boolean);
  } catch (error) {
    // check if the error message contains cyclic keyword
    if (error instanceof Error && error.message.includes("cyclic")) {
      throw new Error("Cyclic graph detected");
    }

    console.error("Error in topological sort:", error);
    throw error;
  }

  return sortedNodeIds.map(
    (nodeId) => nodes.find((node) => node.id === nodeId)!,
  );
};
