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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProviderLogo } from "@/lib/logo";
import { useCreateCredential } from "../../hooks/credentials.hooks";

const aiProviderType = z.enum(["OPENAI", "ANTHROPIC", "GEMINI", "OPENROUTER"]);

const aiCredentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: aiProviderType,
  key: z.string().min(1, "API Key is required"),
});

type AiCredentialFormValues = z.infer<typeof aiCredentialSchema>;

interface AiKeyFormProps {
  onSuccess?: () => void;
}

export function AiKeyForm({ onSuccess }: AiKeyFormProps) {
  const createCredential = useCreateCredential();

  const form = useForm<AiCredentialFormValues>({
    resolver: zodResolver(aiCredentialSchema),
    defaultValues: {
      name: "",
      provider: "OPENAI",
      key: "",
    },
  });

  const onSubmit = (values: AiCredentialFormValues) => {
    createCredential.mutate(
      {
        name: values.name,
        key: values.key,
        provider: values.provider,
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
                <Input placeholder="My OpenAI Key" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPENAI">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="OPENAI" size={16} />
                      OPENAI
                    </div>
                  </SelectItem>
                  <SelectItem value="ANTHROPIC">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="ANTHROPIC" size={16} />
                      ANTHROPIC
                    </div>
                  </SelectItem>
                  <SelectItem value="GEMINI">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="GEMINI" size={16} />
                      GEMINI
                    </div>
                  </SelectItem>
                  <SelectItem value="OPENROUTER">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="OPENROUTER" size={16} />
                      OPENROUTER
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="sk-..." type="password" {...field} />
              </FormControl>
              <FormDescription>
                Your API key will be encrypted securely
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