import type { EndpointDef } from "../types.js";
import {
  pathHost,
  pathQuery,
  qDateRange,
  qDeviceType,
  qPagination,
  qQueryIndicator,
  qQueryOrder,
  wmGet,
  wmWrite,
} from "./helpers.js";

export const searchQueryEndpoints: EndpointDef[] = [
  wmGet(
    "wm_search_queries_popular",
    "/user/{userId}/hosts/{hostId}/search-queries/popular",
    "Top search queries (up to 3000) for the last week",
    {
      pathParams: pathHost,
      queryParams: {
        order_by: qQueryOrder,
        query_indicator: qQueryIndicator,
        device_type_indicator: qDeviceType,
        ...qDateRange,
        offset: qPagination.offset,
        limit: qPagination.limit,
      },
    },
  ),
  wmGet(
    "wm_search_queries_all_history",
    "/user/{userId}/hosts/{hostId}/search-queries/all/history",
    "Aggregate statistics for all search queries",
    {
      pathParams: pathHost,
      queryParams: {
        query_indicator: qQueryIndicator,
        device_type_indicator: qDeviceType,
        ...qDateRange,
      },
    },
  ),
  wmGet(
    "wm_search_queries_history",
    "/user/{userId}/hosts/{hostId}/search-queries/{queryId}/history",
    "Statistics for a specific search query",
    {
      pathParams: pathQuery,
      queryParams: {
        query_indicator: qQueryIndicator,
        device_type_indicator: qDeviceType,
        ...qDateRange,
      },
    },
  ),
  wmWrite(
    "POST",
    "wm_query_analytics_list",
    "/user/{userId}/hosts/{hostId}/query-analytics/list",
    "Query analytics monitor: search queries and landing pages (last 2 weeks). Body: {\"offset\": 0, \"limit\": 100, \"device_type_indicator\": \"ALL\", ...}",
    { pathParams: pathHost, withBody: true },
  ),
];
