"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ReactNode } from "react";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLable?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref?: string; onNew?: never }
  | { newButtonHref?: never; onNew?: never }
);

export const EntityHeader = ({
  title,
  description,
  disabled,
  newButtonLable,
  isCreating,
  newButtonHref,
  onNew,
}: EntityHeaderProps) => {
  return (
    <div className=" w-full flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className=" text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className=" text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button onClick={onNew} size="lg" disabled={isCreating || disabled}>
          <PlusIcon className="size-4" />
          {newButtonLable}
        </Button>
      )}
      {!onNew && newButtonHref && (
        <Button size="lg" asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLable}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 h-full md:px-10 md:py-6 w-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};
