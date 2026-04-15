"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProviderLogo } from "@/lib/logo";
import { useCreateCredential } from "../../hooks/credentials.hooks";

const resendCredentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(1, "API Key is required"),
});

type ResendCredentialFormValues = z.infer<typeof resendCredentialSchema>;

interface ResendFormProps {
  onSuccess?: () => void;
}

export function ResendForm({ onSuccess }: ResendFormProps) {
  const createCredential = useCreateCredential();

  const form = useForm<ResendCredentialFormValues>({
    resolver: zodResolver(resendCredentialSchema),
    defaultValues: {
      name: "",
      key: "",
    },
  });

  const onSubmit = (values: ResendCredentialFormValues) => {
    createCredential.mutate(
      {
        name: values.name,
        key: values.key,
        provider: "RESEND",
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Resend API Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input placeholder="re_..." type="password" {...field} />
              </FormControl>
              <FormDescription>
                Your Resend API key from resend.com
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={createCredential.isPending}>
          {createCredential.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}