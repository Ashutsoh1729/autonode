"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { memo } from "react";

export const AddNodeButton = memo(() => {
  return (
    <Button
      className="bg-background"
      size={"icon"}
      variant={"outline"}
      onClick={() => {}}
    >
      <PlusIcon />
    </Button>
  );
});

AddNodeButton.displayName = "AddNodeButton";
