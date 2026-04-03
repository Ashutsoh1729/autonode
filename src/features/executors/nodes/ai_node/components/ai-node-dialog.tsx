"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useAtomValue, useAtom } from "jotai";
import { credentialsAtom } from "@/features/credentials/store/credentials.atom";
import { useCredentialsSync } from "@/features/credentials/hooks/use-credentials-sync";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  prompt: z.string().min(1, "Prompt is required"),
  model: z
    .string()
    .default("gemini-2.5-flash")
    .optional(),
  temperature: z
    .number()
    .min(0)
    .max(2)
    .default(0.7)
    .optional(),
  maxTokens: z.number().int().positive().optional(),
  credentialId: z.string().default("none"),
});

export type AiNodeFormSchemaType = z.infer<typeof formSchema>;

interface AiExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AiNodeFormSchemaType) => void;
  defaultValues?: Partial<AiNodeFormSchemaType>;
}

export const AiExecutionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: AiExecutionDialogProps) => {
  const form = useForm<AiNodeFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      prompt: defaultValues?.prompt ?? "",
      model: defaultValues?.model ?? "gemini-2.5-flash",
      temperature: defaultValues?.temperature ?? 0.7,
      maxTokens: defaultValues?.maxTokens ?? undefined,
      credentialId: defaultValues?.credentialId ?? "none",
    },
  });

  // Synchronize credentials data from TRPC to Jotai atom
  useCredentialsSync();
  
  const watchVariableName = form.watch("variableName");
  const credentials = useAtomValue(credentialsAtom);

     // Reset the values when the dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        prompt: defaultValues?.prompt ?? "",
        model: defaultValues?.model ?? "gemini-2.5-flash",
        temperature: defaultValues?.temperature ?? 0.7,
        maxTokens: defaultValues?.maxTokens ?? undefined,
        credentialId: defaultValues?.credentialId ?? "none",
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (values: AiNodeFormSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:w-[70vw] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
        <DialogHeader>
          <DialogTitle>AI Node</DialogTitle>
          <DialogDescription>
            Configure settings for AI Node
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4 "
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a variable name" {...field} />
                  </FormControl>
                  <FormDescription>
                    {`{{${watchVariableName == "" ? "variableName" : watchVariableName}.aiResponse}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <FormField
               control={form.control}
               name="prompt"
               render={({ field }) => (
                 <FormItem className="w-full">
                   <FormLabel>Prompt</FormLabel>
                   <FormControl>
                     <Textarea
                       {...field}
                       placeholder="Enter your AI prompt here..."
                       className="min-h-[120px]"
                     />
                   </FormControl>
                    <FormDescription>
                      Enter the instruction for the AI to process.
                    </FormDescription>
                   <FormMessage />
                 </FormItem>
               )}
             />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT 3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT 4</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the AI model to use
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Temperature</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      placeholder="0.7"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Controls randomness: 0 is deterministic, 2 is more random
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Max Tokens</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum number of tokens to generate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
              <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Credential</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a credential (optional)" />
                        </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None (use environment variable)</SelectItem>
                            {credentials.map((cred: { id: string; name: string; provider: string }) => (
                              <SelectItem key={cred.id} value={cred.id}>
                                {cred.name} ({cred.provider})
                              </SelectItem>
                            ))}
                          </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select a stored credential for API key, or leave empty to use environment variables
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            <DialogFooter>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};