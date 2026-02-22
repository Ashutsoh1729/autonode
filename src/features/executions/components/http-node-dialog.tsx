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
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";

const formSchema = z.object({
  endpoint: z.url("Please enter a valid url"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(), // TODO: add refine later
});

export type formSchemaType = z.infer<typeof formSchema>;

interface HttpExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: formSchemaType) => void;
  defaultMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  defaultEndpoint?: string;
  defaultBody?: string;
}

export const HttpExecutionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultBody,
  defaultMethod = "GET",
  defaultEndpoint,
}: HttpExecutionDialogProps) => {
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: defaultBody ?? "",
      method: defaultMethod ?? "GET",
      endpoint: defaultEndpoint ?? "",
    },
  });

  // Reset the values when the dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultEndpoint ?? "",
        method: defaultMethod ?? "GET",
        body: defaultBody ?? "",
      });
    }

    return () => { };
  }, [open, defaultBody, defaultMethod, defaultEndpoint, form]);

  // to show some dynamic fields depending upon the method field
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PATCH", "PUT"].includes(watchMethod);

  const handleSubmit = (values: formSchemaType) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for Http Nod{" "}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4 "
          >
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="select a method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP Method used for this request
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Static URL or use {"{{variables}}"} for simple values or{" "}
                    {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Request Body</FormLabel>
                    <Textarea
                      {...field}
                      placeholder={`{  "key": "value",  "name" "{{variables}}"}`}
                      className="min-h-[120px] text-sm font-mono"
                    />
                    <FormDescription>The body for this request</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
