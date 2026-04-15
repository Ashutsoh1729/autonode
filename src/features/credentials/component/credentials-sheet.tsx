"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AiKeyForm } from "./forms/ai-key-form";
import { ResendForm } from "./forms/resend-form";
import { SmtpForm } from "./forms/smtp-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/lib/logo";

type CredentialType = "ai" | "resend" | "smtp";

interface CredentialsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CredentialsSheet({
  open,
  onOpenChange,
}: CredentialsSheetProps) {
  const [selectedType, setSelectedType] = useState<CredentialType | null>(null);

  const handleSuccess = () => {
    onOpenChange(false);
    setSelectedType(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setSelectedType(null);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      {open && <div className="fixed inset-0 z-40 bg-black/50" />}
      <SheetContent
        side="right"
        className="w-full sm:max-w-[50%]! pt-4 overflow-y-auto"
      >
        <SheetHeader className="px-8">
          <SheetTitle className="text-2xl">Add Credential</SheetTitle>
          <SheetDescription>Store your credentials securely</SheetDescription>
        </SheetHeader>

        {!selectedType ? (
          <div className="mt-2 space-y-4 px-8">
            <p className="text-sm text-muted-foreground">
              Select the type of credential you want to add:
            </p>
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4"
                onClick={() => setSelectedType("ai")}
              >
                <div className="flex items-center gap-3">
                  <ProviderLogo provider="OPENAI" />
                  <div className="text-left">
                    <div className="font-medium">AI Providers</div>
                    <div className="text-xs text-muted-foreground">
                      OpenAI, Anthropic, Gemini, OpenRouter
                    </div>
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4"
                onClick={() => setSelectedType("resend")}
              >
                <div className="flex items-center gap-3">
                  <ProviderLogo provider="RESEND" />
                  <div className="text-left">
                    <div className="font-medium">Resend</div>
                    <div className="text-xs text-muted-foreground">
                      Email delivery via Resend API
                    </div>
                  </div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-4 px-4"
                onClick={() => setSelectedType("smtp")}
              >
                <div className="flex items-center gap-3">
                  <div className="size-5 flex items-center justify-center rounded bg-muted">
                    <span className="text-xs font-bold">SMTP</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">SMTP</div>
                    <div className="text-xs text-muted-foreground">
                      Custom SMTP server (Gmail, Outlook, etc.)
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 pb-6 px-8 ">
            <div className="flex items-center justify-end">
              <Button
                variant="default"
                size="sm"
                className="mb-4 px-6  ms-auto"
                onClick={() => setSelectedType(null)}
              >
                Back
              </Button>
            </div>
            {selectedType === "ai" && <AiKeyForm onSuccess={handleSuccess} />}
            {selectedType === "resend" && (
              <ResendForm onSuccess={handleSuccess} />
            )}
            {selectedType === "smtp" && <SmtpForm onSuccess={handleSuccess} />}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
