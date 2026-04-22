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
                
                const newNodes: Node[] = data.nodes.map((node) => ({
                    id: node.id,
                    type: node.type,
                    position: node.position,
                    data: node.data ?? {},
                }));

                const newEdges: Edge[] = data.edges.map((edge) => ({
                    id: `edge-${edge.source}-${edge.target}-${createId()}`,
                    source: edge.source,
                    target: edge.target,
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