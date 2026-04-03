"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { formatDistanceToNow } from "date-fns";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useRouter } from "next/navigation";
import { PlayIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
  PENDING: "bg-yellow-500",
  RUNNING: "bg-blue-500",
  SUCCESS: "bg-green-500",
  FAILED: "bg-red-500",
};

const triggerTypeLabels = {
  MANUAL: "Manual",
  CRON: "Cron",
  WEBHOOK: "Webhook",
};

export const ExecutionHeader = () => {
  return (
    <EntityHeader
      title="Executions"
      description="view and manage your workflow executions"
      onNew={undefined}
      newButtonLable=""
      disabled={true}
      isCreating={false}
    />
  );
};

export const ExecutionPagination = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={() => {}}
    />
  );
};

type ExecutionItemType = {
  id: number;
  workflowId: number;
  workflowName: string;
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  triggeredAt: Date;
  triggerType: "MANUAL" | "CRON" | "WEBHOOK";
  completedAt: Date | null;
};

export const ExecutionListItem = ({ item }: { item: ExecutionItemType }) => {
  const router = useRouter();

  return (
    <EntityItem
      title={`Execution #${item.id}`}
      href={`/executions/${item.id}`}
      subtitle={
        <>
          <span className="font-medium">{item.workflowName}</span>
          {" • "}
          {formatDistanceToNow(item.triggeredAt, { addSuffix: true })}
          {" • "}
          {triggerTypeLabels[item.triggerType]}
        </>
      }
      image={
        <div className="flex items-center justify-center size-8">
          <PlayIcon className="size-5 text-muted-foreground" />
        </div>
      }
      badge={
        <span
          className={cn(
            "px-2 py-0.5 text-xs text-white rounded-full",
            statusColors[item.status],
          )}
        >
          {item.status}
        </span>
      }
    />
  );
};

export const ExecutionLists = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => {
        return <ExecutionListItem item={execution as ExecutionItemType} />;
      }}
      emptyView={<ExecutionEmpty />}
    />
  );
};

export const ExecutionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionHeader />}
      search={undefined}
      pagination={<ExecutionPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ExecutionLoading = () => {
  return <LoadingView message="Executions are loading..." />;
};

export const ExecutionError = () => {
  return <ErrorView message="Failed to load executions" />;
};

export const ExecutionEmpty = () => {
  return (
    <EmptyView
      onNew={undefined}
      message="No executions yet. Run a workflow to see executions here."
    />
  );
};