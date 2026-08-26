# @rezlazy/yandex-webmaster-mcp

MCP server for [Yandex Webmaster API v4](https://yandex.ru/dev/webmaster/doc/ru/).

Exposes **42 tools** covering sites, verification, sitemaps, search queries, indexing, links, recrawl, diagnostics, and feeds.

## Requirements

- Node.js 20+
- OAuth token with `webmaster:hostinfo` and `webmaster:verify` scopes

## Getting an OAuth token

1. [Create a Yandex OAuth app](https://oauth.yandex.ru/client/new) — choose **Web services**.
2. Set redirect URI to `https://oauth.yandex.ru/verification_code`.
3. Add permissions **webmaster:hostinfo** and **webmaster:verify**.
4. Copy the app **Client ID**.
5. Open in browser:

   ```
   https://oauth.yandex.ru/authorize?response_type=token&client_id=<CLIENT_ID>
   ```

6. Copy the token from the redirect URL (`access_token=...`).

See [Yandex Webmaster authorization docs](https://yandex.ru/dev/webmaster/doc/ru/tasks/how-to-get-oauth.md).

## Cursor configuration

Add to `.cursor/mcp.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "yandex-webmaster": {
      "command": "npx",
      "args": ["-y", "@rezlazy/yandex-webmaster-mcp"],
      "env": {
        "WEBMASTER_TOKEN": "<your-oauth-token>"
      }
    }
  }
}
```

For local development (`.cursor/mcp.json` in this repo):

```json
{
  "mcpServers": {
    "yandex-webmaster": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"],
      "envFile": "${workspaceFolder}/.env"
    }
  }
}
```

Create `.env` in the project root:

```env
WEBMASTER_TOKEN=your_oauth_token
```

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `WEBMASTER_TOKEN` | yes | OAuth token (`webmaster:hostinfo`, `webmaster:verify`) |
| `WEBMASTER_API_URL` | no | API base URL (default: `https://api.webmaster.yandex.net/v4`) |

## Typical workflow

1. **`wm_user_get`** — get `userId`
2. **`wm_hosts_list`** — list sites, get `hostId` (e.g. `https:example.com:443`)
3. Use host-specific tools with `userId` and `hostId`

## Tools

### User & sites

| Tool | Description |
|------|-------------|
| `wm_user_get` | Get current user ID |
| `wm_hosts_list` | List user's sites |
| `wm_host_add` | Add a site |
| `wm_host_get` | Get site details |
| `wm_host_delete` | Remove a site |
| `wm_host_summary` | Site summary statistics |
| `wm_owners_list` | Users who verified the site |
| `wm_sqi_history` | SQI change history |

### Verification & diagnostics

| Tool | Description |
|------|-------------|
| `wm_verification_get` | Verification status |
| `wm_verification_start` | Start ownership verification |
| `wm_diagnostics` | Site problems and recommendations |
| `wm_important_urls` | Important pages monitor |
| `wm_important_urls_history` | Important page change history |

### Sitemaps

| Tool | Description |
|------|-------------|
| `wm_sitemaps_list` | Discovered sitemaps |
| `wm_sitemap_get` | Sitemap details |
| `wm_user_sitemaps_list` | User-added sitemaps |
| `wm_user_sitemap_add` | Add sitemap URL |
| `wm_user_sitemap_get` | User-added sitemap details |
| `wm_user_sitemap_delete` | Delete user-added sitemap |

### Search queries

| Tool | Description |
|------|-------------|
| `wm_search_queries_popular` | Top search queries (last week) |
| `wm_search_queries_all_history` | Aggregate query statistics |
| `wm_search_queries_history` | Single query statistics |
| `wm_query_analytics_list` | Query analytics monitor |

### Indexing & search presence

| Tool | Description |
|------|-------------|
| `wm_indexing_history` | Crawl/indexing history |
| `wm_indexing_samples` | Sample crawled pages |
| `wm_insearch_history` | Pages in search — history |
| `wm_insearch_samples` | Sample pages in search |
| `wm_search_events_history` | Pages added/removed from search |
| `wm_search_events_samples` | Sample added/removed pages |

### Links

| Tool | Description |
|------|-------------|
| `wm_links_internal_broken_samples` | Broken internal links |
| `wm_links_internal_broken_history` | Broken internal links history |
| `wm_links_external_samples` | External links samples |
| `wm_links_external_history` | External links history |

### Recrawl

| Tool | Description |
|------|-------------|
| `wm_recrawl_queue_list` | Recrawl task queue |
| `wm_recrawl_submit` | Submit URL for recrawl |
| `wm_recrawl_quota` | Daily recrawl quota |
| `wm_recrawl_task_get` | Recrawl task status |

### Feeds

| Tool | Description |
|------|-------------|
| `wm_feeds_list` | Uploaded feeds |
| `wm_feeds_add_start` | Start async feed upload |
| `wm_feeds_add_info` | Async upload status |
| `wm_feeds_batch_add` | Upload multiple feeds |
| `wm_feeds_batch_remove` | Remove multiple feeds |

### Example: list sites

Tool: `wm_hosts_list`

```json
{
  "userId": 12345678
}
```

### Example: top search queries

Tool: `wm_search_queries_popular`

```json
{
  "userId": 12345678,
  "hostId": "https:example.com:443",
  "order_by": "TOTAL_CLICKS",
  "limit": 50
}
```

### Example: submit recrawl

Tool: `wm_recrawl_submit`

```json
{
  "userId": 12345678,
  "hostId": "https:example.com:443",
  "body": {
    "url": "https://example.com/new-page"
  }
}
```

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## License

MIT
