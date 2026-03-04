import { NodeExecutor } from "@/features/executions/lib/types";
import { HttpRequestNodeData } from "../components/http-node";
import { NonRetriableError } from "inngest";
import ky, { type Options } from "ky";
import Handlebars from "handlebars";
import { httpRequestChannel } from "@/inngest/channels/http-request";

// TODO: Modify if any additional functionality is needed

// we have to register a helper to stringify objects
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

// as for manual trigger data does not exists
export const httpNodeExecutor: NodeExecutor<HttpRequestNodeData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(httpRequestChannel().status({ nodeId, status: "loading" }));

  if (!data.endpoint) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No http endpoint is configured");
  }

  if (!data.variableName) {
    await publish(httpRequestChannel().status({ nodeId, status: "error" }));
    throw new NonRetriableError("No http variable name is configured");
  }

  const result = await step.run("http-trigger", async () => {
    const method = data.method || "GET"; // default to GET
    // here the endpoint will look like https://jsonplaceholder.typicode.com/posts/{{id}}
    const endpoint = Handlebars.compile(data.endpoint)(context);
    const options: Options = {
      method,
    };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      // it will protect us from any invalid json being passed
      JSON.parse(resolved);

      options.body = resolved;

      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") || "";
    const responseText = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseText,
      },
    };

    // TODO; Look why is it showing error
    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  //  TODO: Publish "loading " state for http trigger

  // TODO: Publish "success" state for http trigger

  await publish(
    httpRequestChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
