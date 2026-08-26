import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { catalog } from "./api/catalog.js";
import { WebmasterApiError, type WebmasterClient } from "./client.js";
import { buildZodShape, executeEndpoint } from "./execute.js";

function formatResult(data: unknown): string {
  if (data === null || data === undefined) {
    return "null";
  }
  return typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

export function registerAllTools(
  server: McpServer,
  client: WebmasterClient,
): void {
  for (const def of catalog) {
    const shape = buildZodShape(def);
    server.tool(def.name, def.description, shape, async (args) => {
      try {
        const result = await executeEndpoint(
          client,
          def,
          args as Record<string, unknown>,
        );
        return {
          content: [{ type: "text" as const, text: formatResult(result) }],
        };
      } catch (err) {
        const message =
          err instanceof WebmasterApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : String(err);
        return {
          content: [{ type: "text" as const, text: message }],
          isError: true,
        };
      }
    });
  }
}
