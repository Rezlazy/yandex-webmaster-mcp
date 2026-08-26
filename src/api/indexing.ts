import type { EndpointDef } from "../types.js";
import { enumStr, str } from "../types.js";
import {
  pathHost,
  pathTask,
  qDateRange,
  qPagination,
  wmGet,
  wmWrite,
} from "./helpers.js";

export const recrawlEndpoints: EndpointDef[] = [
  wmGet(
    "wm_recrawl_queue_list",
    "/user/{userId}/hosts/{hostId}/recrawl/queue",
    "List recrawl tasks",
    {
      pathParams: pathHost,
      queryParams: qPagination,
    },
  ),
  wmWrite(
    "POST",
    "wm_recrawl_submit",
    "/user/{userId}/hosts/{hostId}/recrawl/queue",
    "Submit a URL for recrawl. Body: {\"url\": \"https://example.com/page\"}",
    { pathParams: pathHost, withBody: true },
  ),
  wmGet(
    "wm_recrawl_quota",
    "/user/{userId}/hosts/{hostId}/recrawl/quota",
    "Check daily recrawl quota",
    { pathParams: pathHost },
  ),
  wmGet(
    "wm_recrawl_task_get",
    "/user/{userId}/hosts/{hostId}/recrawl/queue/{taskId}",
    "Get recrawl task status",
    { pathParams: pathTask },
  ),
];

export const indexingEndpoints: EndpointDef[] = [
  wmGet(
    "wm_indexing_history",
    "/user/{userId}/hosts/{hostId}/indexing/history",
    "Indexed pages count and HTTP status history",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
  wmGet(
    "wm_indexing_samples",
    "/user/{userId}/hosts/{hostId}/indexing/samples",
    "Sample of crawled pages",
    {
      pathParams: pathHost,
      queryParams: {
        ...qPagination,
        url: str("Filter by URL prefix", true),
      },
    },
  ),
  wmGet(
    "wm_insearch_history",
    "/user/{userId}/hosts/{hostId}/search-urls/in-search/history",
    "History of pages count in search results",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
  wmGet(
    "wm_insearch_samples",
    "/user/{userId}/hosts/{hostId}/search-urls/in-search/samples",
    "Sample pages currently in search",
    {
      pathParams: pathHost,
      queryParams: qPagination,
    },
  ),
  wmGet(
    "wm_search_events_history",
    "/user/{userId}/hosts/{hostId}/search-urls/events/history",
    "History of pages added/removed from search",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
  wmGet(
    "wm_search_events_samples",
    "/user/{userId}/hosts/{hostId}/search-urls/events/samples",
    "Sample pages added or removed from search",
    {
      pathParams: pathHost,
      queryParams: {
        ...qPagination,
        event_type: enumStr(
          ["APPEARED", "REMOVED"],
          "Filter by event type",
          true,
        ),
      },
    },
  ),
];

export const linksEndpoints: EndpointDef[] = [
  wmGet(
    "wm_links_internal_broken_samples",
    "/user/{userId}/hosts/{hostId}/links/internal/broken/samples",
    "Broken internal links samples",
    {
      pathParams: pathHost,
      queryParams: qPagination,
    },
  ),
  wmGet(
    "wm_links_internal_broken_history",
    "/user/{userId}/hosts/{hostId}/links/internal/broken/history",
    "Broken internal links count history",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
  wmGet(
    "wm_links_external_samples",
    "/user/{userId}/hosts/{hostId}/links/external/samples",
    "External links to the site samples",
    {
      pathParams: pathHost,
      queryParams: qPagination,
    },
  ),
  wmGet(
    "wm_links_external_history",
    "/user/{userId}/hosts/{hostId}/links/external/history",
    "External links count history",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
];
