# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-08-31

### Fixed

- `wm_verification_start`: `verification_type` is sent as a required query parameter (per Yandex API), not in the JSON body

## [0.1.1] - 2026-08-31

### Added

- `prepare` script so `npx github:Rezlazy/yandex-webmaster-mcp` builds `dist` on install
- README example for installing the MCP server from GitHub

## [0.1.0] - 2026-08-27

### Added

- Initial MCP server for [Yandex Webmaster API v4](https://yandex.ru/dev/webmaster/doc/ru/)
- **42 MCP tools** covering the full public API:
  - User & sites: `wm_user_get`, `wm_hosts_list`, `wm_host_add`, `wm_host_get`, `wm_host_delete`, `wm_host_summary`, `wm_owners_list`, `wm_sqi_history`
  - Verification & diagnostics: `wm_verification_get`, `wm_verification_start`, `wm_diagnostics`, `wm_important_urls`, `wm_important_urls_history`
  - Sitemaps: `wm_sitemaps_list`, `wm_sitemap_get`, `wm_user_sitemaps_list`, `wm_user_sitemap_add`, `wm_user_sitemap_get`, `wm_user_sitemap_delete`
  - Search queries: `wm_search_queries_popular`, `wm_search_queries_all_history`, `wm_search_queries_history`, `wm_query_analytics_list`
  - Indexing & search: `wm_indexing_history`, `wm_indexing_samples`, `wm_insearch_history`, `wm_insearch_samples`, `wm_search_events_history`, `wm_search_events_samples`
  - Links: `wm_links_internal_broken_samples`, `wm_links_internal_broken_history`, `wm_links_external_samples`, `wm_links_external_history`
  - Recrawl: `wm_recrawl_queue_list`, `wm_recrawl_submit`, `wm_recrawl_quota`, `wm_recrawl_task_get`
  - Feeds: `wm_feeds_list`, `wm_feeds_add_start`, `wm_feeds_add_info`, `wm_feeds_batch_add`, `wm_feeds_batch_remove`
- stdio MCP transport (Cursor, Claude Desktop, etc.)
- OAuth authentication via `WEBMASTER_TOKEN` (`webmaster:hostinfo`, `webmaster:verify`)
- Catalog-based tool registration with Zod parameter validation
- Server instructions for MCP clients (workflow: user → hosts → host tools)
- README with setup guide, tool list, and usage examples
- Vitest test suite (14 tests)

[0.1.2]: https://github.com/Rezlazy/yandex-webmaster-mcp/releases/tag/v0.1.2
[0.1.1]: https://github.com/Rezlazy/yandex-webmaster-mcp/releases/tag/v0.1.1
[0.1.0]: https://github.com/Rezlazy/yandex-webmaster-mcp/releases/tag/v0.1.0
