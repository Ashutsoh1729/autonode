"use client";

// TODO: Change everything

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
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  provider: z.enum(["OPENAI", "ANTHROPIC", "GEMINI"]),
  key: z
    .string()
    .min(1, "API key is required")
    .refine(
      (val) =>
        /^sk-(proj-)?[a-zA-Z0-9_-]{40,}$/.test(val) ||
        /^sk-ant-api03-[a-zA-Z0-9_-]{80,}$/.test(val) ||
        /^AIza[a-zA-Z0-9_-]{35}$/.test(val),
      { message: "Invalid API key format" },
    ),
});

export type CredentialsInputFormSchemaType = z.infer<typeof formSchema>;

interface CredentialsInputFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CredentialsInputFormSchemaType) => void;
  defaultValues?: Partial<CredentialsInputFormSchemaType>;
}

export const CredentialsInputForm = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: CredentialsInputFormProps) => {
  const form = useForm<CredentialsInputFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      key: defaultValues?.key ?? "",
      provider: defaultValues?.provider ?? "OPENAI",
    },
  });

  // Reset the values when the dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        name: defaultValues?.name ?? "",
        provider: defaultValues?.provider ?? "OPENAI",
        key: defaultValues?.key ?? "",
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (values: CredentialsInputFormSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className=" lg:w-[70vw] h-[90vh] scroll overflow-y-auto "> */}
      <DialogContent className="lg:w-[70vw] max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-500 [&::-webkit-scrollbar-thumb]:rounded-full">
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for Http Nod{" "}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4 "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a variable name" {...field} />
                  </FormControl>
                  <FormDescription>Give a valid name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPENAI">OPENAI</SelectItem>
                      <SelectItem value="GEMINI">GEMINI</SelectItem>
                      <SelectItem value="ANTHROPIC">ANTHROPIC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The provider that api key belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Api Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a valid api key" {...field} />
                  </FormControl>
                  <FormDescription>Give an active api key</FormDescription>
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
