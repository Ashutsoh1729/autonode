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
  cronExpression: z.string().min(1, "Cron expression is required"),
  scheduledAt: z.string().optional(),
  executionType: z.enum(["cron", "one-time"]),
  enabled: z.boolean(),
  timezone: z.string(),
});

export type CronNodeFormSchemaType = z.infer<typeof formSchema>;

interface CronJobTriggerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: CronNodeFormSchemaType) => void;
  onDelete?: () => void;
  defaultValues?: Partial<CronNodeFormSchemaType>;
}

const CRON_PRESETS = [
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every day at 9 AM", value: "0 9 * * *" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every month on 1st", value: "0 0 1 * *" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Chicago", label: "Central Time (US)" },
  { value: "America/Denver", label: "Mountain Time (US)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "America/Anchorage", label: "Alaska" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Paris" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Asia/Shanghai", label: "Shanghai" },
  { value: "Asia/Kolkata", label: "India" },
  { value: "Asia/Dubai", label: "Dubai" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Australia/Sydney", label: "Sydney" },
];

export const CronJobTriggerDialog = ({
  open,
  onOpenChange,
  onSave,
  onDelete,
  defaultValues = {
    executionType: "cron",
    cronExpression: "0 * * * *",
    enabled: true,
    timezone: "UTC",
  },
}: CronJobTriggerDialogProps) => {
  const form = useForm<CronNodeFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cronExpression: defaultValues?.cronExpression ?? "0 * * * *",
      scheduledAt: defaultValues?.scheduledAt ?? "",
      executionType: defaultValues?.executionType ?? "cron",
      enabled: defaultValues?.enabled ?? true,
      timezone: defaultValues?.timezone ?? "UTC",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        cronExpression: defaultValues?.cronExpression ?? "0 * * * *",
        scheduledAt: defaultValues?.scheduledAt ?? "",
        executionType: defaultValues?.executionType ?? "cron",
        enabled: defaultValues?.enabled ?? true,
        timezone: defaultValues?.timezone ?? "UTC",
      });
    }
  }, [open, defaultValues, form]);

  const watchExecutionType = form.watch("executionType");

  const handleSubmit = (values: CronNodeFormSchemaType) => {
    onSave(values);
    onOpenChange(false);
  };

  const handlePresetClick = (cronExpression: string) => {
    form.setValue("cronExpression", cronExpression);
    form.setValue("executionType", "cron");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cron Trigger</DialogTitle>
          <DialogDescription>
            Configure schedule for automatic workflow execution
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={form.control}
              name="executionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Execution Type</FormLabel>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={field.value === "cron" ? "default" : "outline"}
                      size="sm"
                      onClick={() => field.onChange("cron")}
                    >
                      Recurring (Cron)
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "one-time" ? "default" : "outline"}
                      size="sm"
                      onClick={() => field.onChange("one-time")}
                    >
                      One-time
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            {watchExecutionType === "cron" && (
              <>
                <div className="space-y-2">
                  <FormLabel>Schedule Preset</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {CRON_PRESETS.map((preset) => (
                      <Button
                        key={preset.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handlePresetClick(preset.value)}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="cronExpression"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cron Expression</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0 * * * *"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Format: minute hour day month weekday
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIMEZONES.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {watchExecutionType === "one-time" && (
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Trigger
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Automatically execute workflow on schedule
                    </p>
                  </div>
                  <FormControl>
                    <Input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onDelete();
                    onOpenChange(false);
                  }}
                >
                  Delete
                </Button>
              )}
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};