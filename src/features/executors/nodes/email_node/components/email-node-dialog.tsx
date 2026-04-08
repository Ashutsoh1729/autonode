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
import { useAtomValue } from "jotai";
import { credentialsAtom } from "@/features/credentials/store/credentials.atom";
import { useCredentialsSync } from "@/features/credentials/hooks/use-credentials-sync";

const formSchema = z.object({
  provider: z.literal("resend"),
  fromEmail: z.string().min(1, "Sender email is required"),
  fromName: z.string().optional(),
  to: z.string().min(1, "Recipient email is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  replyTo: z.string().optional(),
  credentialId: z.string(),
});

export type EmailNodeFormSchemaType = z.infer<typeof formSchema>;

interface EmailExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: EmailNodeFormSchemaType) => void;
  defaultValues?: Partial<EmailNodeFormSchemaType>;
}

export const EmailExecutionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: EmailExecutionDialogProps) => {
  const form = useForm<EmailNodeFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "resend",
      fromEmail: defaultValues?.fromEmail ?? "",
      fromName: defaultValues?.fromName ?? "",
      to: defaultValues?.to ?? "",
      subject: defaultValues?.subject ?? "",
      body: defaultValues?.body ?? "",
      replyTo: defaultValues?.replyTo ?? "",
      credentialId: defaultValues?.credentialId ?? "none",
    },
  });

  useCredentialsSync();
  const credentials = useAtomValue(credentialsAtom);

  useEffect(() => {
    if (open) {
      form.reset({
        provider: "resend",
        fromEmail: defaultValues?.fromEmail ?? "",
        fromName: defaultValues?.fromName ?? "",
        to: defaultValues?.to ?? "",
        subject: defaultValues?.subject ?? "",
        body: defaultValues?.body ?? "",
        replyTo: defaultValues?.replyTo ?? "",
        credentialId: defaultValues?.credentialId ?? "none",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (values: EmailNodeFormSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const resendCredentials = credentials.filter(
    (cred) => cred.provider === "RESEND"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:w-[70vw] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
        <DialogHeader>
          <DialogTitle>Email Node</DialogTitle>
          <DialogDescription>
            Configure email sending settings
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Currently only Resend is supported
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
                  <FormLabel>Resend Credential</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a credential" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (use RESEND_API_KEY env)</SelectItem>
                      {resendCredentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a stored Resend API key, or leave empty to use RESEND_API_KEY environment variable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>From Email</FormLabel>
                  <FormControl>
                    <Input placeholder="noreply@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>From Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="My App" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>To (Recipient)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="{{item.email}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use {"{{variable}}"} for dynamic values
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Hello {{item.name}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use {"{{variable}}"} for dynamic values
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Body (HTML)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="<h1>Hello {{item.name}}!</h1>"
                      className="min-h-[120px] text-sm font-mono"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    HTML body with {"{{variable}}"} for dynamic values
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replyTo"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Reply To (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="support@example.com"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
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