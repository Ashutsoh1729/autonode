"use client";

import { memo, useState } from "react";
import { SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useGenerateWorkflow } from "../hooks/workflow-generator";

export const AiWorkflowGeneratorSheet = memo(() => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const generateMutation = useGenerateWorkflow();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    generateMutation.mutate({ prompt }, {
      onSuccess: (data) => {
        console.log(data);
        setPrompt("");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        handleGenerate();
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-background" size="icon" variant="outline" title="Generate with AI">
          <SparklesIcon />
        </Button>
      </SheetTrigger>
      {open && <div className="fixed inset-0 z-40 bg-black/50" />}
      <SheetContent
        side="right"
        className="w-full sm:max-w-[50%]! p-0 flex flex-col h-full"
      >
        <SheetHeader className="px-8 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg">AI Workflow Generator</SheetTitle>
          <SheetDescription className="text-[14px]">
            Describe the workflow you want to create, and the AI will generate the basic structure for you.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center text-center">
          <SparklesIcon className="size-12 text-muted-foreground/20 mb-4" />
          <p className="text-sm text-muted-foreground">
            Hi! Tell me what kind of workflow you'd like to build.
          </p>
        </div>

        <div className="mt-auto shrink-0 flex flex-col gap-4 px-8 py-6 border-t bg-background">
          <Textarea
            placeholder="e.g., A flow that runs every day at 9 AM, fetches stock prices via HTTP, and emails the result."
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleGenerate}
            className="w-full"
            disabled={generateMutation.isPending || !prompt.trim()}
          >
            {generateMutation.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <SparklesIcon className="mr-2 size-4" />
            )}
            {generateMutation.isPending ? "Generating..." : "Generate"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
});

AiWorkflowGeneratorSheet.displayName = "AiWorkflowGeneratorSheet";
