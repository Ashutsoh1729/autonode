import { NodeExecutor } from "@/features/executions/lib/types";
import { HttpRequestNodeData } from "../components/http-node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";

// as for manual trigger data does not exists
export const httpNodeExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("No http endpoint is configured");
  }

  const result = await step.run("http-trigger", async () => {
    const method = data.method || "GET";
    const endpoint = data.endpoint!;
    const options: Options = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      options.json = data.body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") || "";
    const responseText = contentType.includes("application/json")
      ? JSON.stringify(await response.json())
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      },
    };
  });

  //  TODO: Publish "loading " state for http trigger

  // TODO: Publish "success" state for http trigger

  return result;
};
