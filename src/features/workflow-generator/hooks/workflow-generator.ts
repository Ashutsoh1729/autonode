import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useReactFlow, type Node, type Edge } from "@xyflow/react";
import { createId } from "@paralleldrive/cuid2";


export const useGenerateWorkflow = () => {
    const trpc = useTRPC();
    const { setNodes, setEdges, fitView } = useReactFlow();

    return useMutation(
        trpc.workflowGenerator.generate.mutationOptions({
            onSuccess: (data) => {
                toast.success("Workflow successfully generated!");
                
                // Map AI generated IDs to CUIDs so they don't collide in DB
                const idMap = new Map<string, string>();
                
                const newNodes: Node[] = data.nodes.map((node) => {
                    const newId = createId();
                    idMap.set(node.id, newId);
                    return {
                        id: newId,
                        type: node.type,
                        position: node.position,
                        data: node.data ?? {},
                    };
                });

                const newEdges: Edge[] = data.edges.map((edge) => ({
                    id: `edge-${edge.source}-${edge.target}-${createId()}`,
                    source: idMap.get(edge.source) || edge.source,
                    target: idMap.get(edge.target) || edge.target,
                    sourceHandle: "source-1",
                    targetHandle: "target-1",
                }));

                setNodes(newNodes);
                setEdges(newEdges);
                
                setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100);
            },
            onError: (error) => {
                toast.error(error.message || "Something went wrong.");
            }
        })
    );
}