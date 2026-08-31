import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { WebmasterClient } from "./client.js";
import { registerAllTools } from "./register.js";
import { assertUniqueToolNames } from "./api/catalog.js";

const PACKAGE_VERSION = "0.1.2";

const SERVER_INSTRUCTIONS = `Tools for Yandex Webmaster API v4 (https://yandex.ru/dev/webmaster/doc/ru/).

Workflow:
1. Call wm_user_get to get userId.
2. Call wm_hosts_list with userId to list sites and get hostId values.
3. Use host-specific tools with userId and hostId.

OAuth scopes: webmaster:hostinfo, webmaster:verify.
Many endpoints require verified site ownership (HOST_NOT_VERIFIED otherwise).`;

async function main(): Promise<void> {
  assertUniqueToolNames();
  const config = loadConfig();
  const client = new WebmasterClient(config);

  const server = new McpServer(
    {
      name: "yandex-webmaster-mcp",
      version: PACKAGE_VERSION,
    },
    {
      instructions: SERVER_INSTRUCTIONS,
    },
  );

  registerAllTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
