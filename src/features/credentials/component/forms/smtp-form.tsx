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
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCredential } from "../../hooks/credentials.hooks";

const smtpCredentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  smtp: z.object({
    host: z.string().min(1, "SMTP host is required"),
    port: z.number().min(1).max(65535),
    secure: z.boolean(),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    fromEmail: z.string().email("Valid email is required"),
  }),
});

type SmtpCredentialFormValues = z.infer<typeof smtpCredentialSchema> & {
  smtp: {
    secure: boolean;
  };
};

interface SmtpFormProps {
  onSuccess?: () => void;
}

export function SmtpForm({ onSuccess }: SmtpFormProps) {
  const createCredential = useCreateCredential();

  const form = useForm<SmtpCredentialFormValues>({
    resolver: zodResolver(smtpCredentialSchema),
    defaultValues: {
      name: "",
      smtp: {
        host: "",
        port: 587,
        secure: false,
        username: "",
        password: "",
        fromEmail: "",
      },
    },
  });

  const onSubmit = (values: SmtpCredentialFormValues) => {
    createCredential.mutate(
      {
        name: values.name,
        provider: "SMTP",
        smtp: values.smtp,
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
                <Input placeholder="My SMTP Server" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smtp.host"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Host</FormLabel>
              <FormControl>
                <Input placeholder="smtp.gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="smtp.port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="587"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="smtp.secure"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-6">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Use TLS/SSL</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="smtp.username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="your-email@gmail.com" {...field} />
              </FormControl>
              <FormDescription>Usually your email address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smtp.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password / App Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password or app password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                For Gmail, use an App Password (16 chars)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="smtp.fromEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From Email</FormLabel>
              <FormControl>
                <Input placeholder="your-email@gmail.com" {...field} />
              </FormControl>
              <FormDescription>
                The email address messages will be sent from
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={createCredential.isPending}
        >
          {createCredential.isPending ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}

