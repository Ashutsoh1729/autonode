import { config } from "@/lib/config";

const API_BASE = "https://api.cron-job.org/jobs";
const API_KEY = config.cronKey;

export type JobId = number;

export type CronJobParams = {
  url: string;
  cronExpression: string;
  enabled: boolean;
  webhookSecret: string;
  timezone?: string;
};

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };
}

function parseCronExpression(expression: string) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(
      "Invalid cron expression. Expected 5 parts: minute hour day month weekday",
    );
  }

  const [minute, hour, day, month, weekday] = parts;

  return {
    minutes: parseCronField(minute, 0, 59),
    hours: parseCronField(hour, 0, 23),
    mdays: parseCronField(day, 1, 31),
    months: parseCronField(month, 1, 12),
    wdays: parseCronField(weekday, 0, 6),
  };
}

function parseCronField(field: string, min: number, max: number): number[] {
  if (field === "*") {
    return [-1];
  }

  if (field.includes(",")) {
    return field.split(",").flatMap((f) => parseCronField(f, min, max));
  }

  if (field.includes("/")) {
    const [, step] = field.split("/");
    const result: number[] = [];
    for (let i = min; i <= max; i += parseInt(step, 10)) {
      result.push(i);
    }
    return result.length > 0 ? result : [-1];
  }

  if (field.includes("-")) {
    const [start, end] = field.split("-").map(Number);
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  }

  return [parseInt(field, 10)];
}

export async function createJob(params: CronJobParams): Promise<JobId> {
  const {
    url,
    cronExpression,
    enabled,
    webhookSecret,
    timezone = "UTC",
  } = params;
  const schedule = parseCronExpression(cronExpression);

  const res = await fetch(API_BASE, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({
      job: {
        url,
        enabled,
        saveResponses: true,
        requestMethod: 1, // 0=GET, 1=POST ← add this
        requestHeaders: {
          // ← add this
          "ngrok-skip-browser-warning": "true",
        },
        schedule: {
          timezone,
          expiresAt: 0,
          ...schedule,
        },
        authentication: {
          type: "basic",
          username: "cron-webhook",
          password: webhookSecret,
        },
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    throw new Error(`Create failed: ${res.status}`);
  }

  console.log("Created job:", data.jobId);

  return data.jobId;
}

export async function updateJob(jobId: JobId, params: Partial<CronJobParams>) {
  const jobUpdate: Record<string, unknown> = {};

  if (params.url !== undefined) {
    jobUpdate.url = params.url;
  }

  if (params.enabled !== undefined) {
    jobUpdate.enabled = params.enabled;
  }

  if (params.cronExpression !== undefined) {
    const schedule = parseCronExpression(params.cronExpression);
    const tz = params.timezone ?? "UTC";
    jobUpdate.schedule = {
      timezone: tz,
      expiresAt: 0,
      ...schedule,
    };
  }

  if (params.webhookSecret !== undefined) {
    jobUpdate.authentication = {
      type: "basic",
      username: "cron-webhook",
      password: params.webhookSecret,
    };
  }

  jobUpdate.requestHeaders = { "ngrok-skip-browser-warning": "true" };
  jobUpdate.requestMethod = 1;

  const res = await fetch(`${API_BASE}/${jobId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ job: jobUpdate }),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Update failed: ${res.status}`);
  }

  console.log("Updated job:", jobId);
}

export async function deleteJob(jobId: JobId) {
  const res = await fetch(`${API_BASE}/${jobId}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!res.ok) {
    console.error(await res.text());
    throw new Error(`Delete failed: ${res.status}`);
  }

  console.log("Deleted job:", jobId);
}
