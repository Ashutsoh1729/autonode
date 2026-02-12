"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

const DashboardSections = ({ userName }: { userName: string }) => {
  const utils = api.useUtils();
  const { data: workflows, isLoading } = api.workflows.getWorkflows.useQuery();

  const createMutation = api.workflows.createWorkflows.useMutation({
    onSuccess: () => {
      toast.success("Workflow created!");
      utils.workflows.getWorkflows.invalidate();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  return (
    <div className="w-full flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-6 flex flex-col justify-center items-center">
          <h3 className="font-semibold mb-2">Create New</h3>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Workflow"}
          </Button>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">Workflows</h3>
          <div className="text-sm font-mono">
            {isLoading ? "Loading..." : workflows?.length} count
          </div>
        </div>
        <div className="aspect-video rounded-xl bg-muted/50"></div>
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome back, {userName}!</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {workflows?.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
                <CardDescription>ID: {workflow.id}</CardDescription>
              </CardHeader>
            </Card>
          ))}

          {workflows?.length === 0 && (
            <p className="text-muted-foreground col-span-full">
              No workflows found. Create one above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSections;
