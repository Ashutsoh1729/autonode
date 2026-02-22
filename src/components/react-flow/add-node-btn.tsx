"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { memo, useState } from "react";
import { NodeSelector } from "./node-selecter";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button className="bg-background" size={"icon"} variant={"outline"}>
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
