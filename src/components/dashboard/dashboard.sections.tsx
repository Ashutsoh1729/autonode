"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSuspenceWorkflows } from "@/features/workflows/hooks/use-workflows";

const DashboardSections = ({ userName }: { userName: string }) => {
  // throw new Error("Some error has happened");
  const { data: workflows } = useSuspenceWorkflows();

  return (
    <div className=" mt-0 w-full flex flex-1 flex-col gap-4 pt-0">
      <div className="h-full flex-1 rounded-xl bg-muted/50 px-4">
        {/*         <h1 className="text-2xl font-bold mb-4">Welcome back, {userName}!</h1> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {workflows.items?.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <CardTitle>{workflow.name}</CardTitle>
                <CardDescription>ID: {workflow.id}</CardDescription>
              </CardHeader>
            </Card>
          ))}

          {workflows.items?.length === 0 && (
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
