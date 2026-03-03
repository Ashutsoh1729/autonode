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

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
      "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    ),
  endpoint: z.url("Please enter a valid url"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(), // TODO: add refine later
});

export type HttpNodeFormSchemaType = z.infer<typeof formSchema>;

interface HttpExecutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpNodeFormSchemaType) => void;
  defaultValues?: Partial<HttpNodeFormSchemaType>;
}

export const HttpExecutionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: HttpExecutionDialogProps) => {
  const form = useForm<HttpNodeFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      body: defaultValues?.body ?? "",
      method: defaultValues?.method ?? "GET",
      endpoint: defaultValues?.endpoint ?? "",
    },
  });

  const watchVariableName = form.watch("variableName");

  // Reset the values when the dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        endpoint: defaultValues?.endpoint ?? "",
        method: defaultValues?.method ?? "GET",
        body: defaultValues?.body ?? "",
      });
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // to show some dynamic fields depending upon the method field
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PATCH", "PUT"].includes(watchMethod);

  const handleSubmit = (values: HttpNodeFormSchemaType) => {
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
                    {`{{${watchVariableName == "" ? "variableName" : watchVariableName}.httpResponse.data}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <FormDescription>{`JSON with template variables. Use {{variables}} for simple variables and {{json.variable}} to stringify the object`}</FormDescription>
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
