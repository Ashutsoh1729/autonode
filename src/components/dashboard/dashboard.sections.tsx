"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSuspenceWorkflows } from "@/hooks/use-workflows";

const DashboardSections = ({ userName }: { userName: string }) => {
  const { data: workflows } = useSuspenceWorkflows();

  return (
    <div className=" mt-8 w-full flex flex-1 flex-col gap-4 pt-0">
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 px-4">
        {/*         <h1 className="text-2xl font-bold mb-4">Welcome back, {userName}!</h1> */}

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
