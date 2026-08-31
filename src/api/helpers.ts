import type { EndpointDef } from "../types.js";
import { enumStr, num, str } from "../types.js";

export const DOCS = "https://yandex.ru/dev/webmaster/doc/ru/";

export const pathUserId = {
  userId: num("User ID from wm_user_get"),
};

export const pathHost = {
  ...pathUserId,
  hostId: str("Host ID from wm_hosts_list (e.g. https:example.com:443)"),
};

export const pathSitemap = {
  ...pathHost,
  sitemapId: str("Sitemap ID"),
};

export const pathQuery = {
  ...pathHost,
  queryId: str("Search query ID from wm_search_queries_popular"),
};

export const pathTask = {
  ...pathHost,
  taskId: str("Recrawl task UUID"),
};

export const qDateRange = {
  date_from: str("Start date (YYYY-MM-DD or datetime)", true),
  date_to: str("End date (YYYY-MM-DD or datetime)", true),
};

export const qPagination = {
  offset: num("List offset (default 0)", true),
  limit: num("Page size", true),
};

export const qQueryOrder = enumStr(
  ["TOTAL_SHOWS", "TOTAL_CLICKS"],
  "Sort order for search queries",
);

export const qQueryIndicator = enumStr(
  ["TOTAL_SHOWS", "TOTAL_CLICKS", "AVG_SHOW_POSITION", "AVG_CLICK_POSITION"],
  "Query indicator to display",
  true,
);

export const qDeviceType = enumStr(
  ["ALL", "DESKTOP", "MOBILE_AND_TABLET", "MOBILE", "TABLET"],
  "Device type filter (default ALL)",
  true,
);

export const qVerificationType = enumStr(
  ["META_TAG", "HTML_FILE", "DNS"],
  "Verification method (ApiExplicitVerificationType)",
);

export function wmGet(
  name: string,
  path: string,
  description: string,
  opts?: {
    pathParams?: EndpointDef["pathParams"];
    queryParams?: EndpointDef["queryParams"];
  },
): EndpointDef {
  return {
    name,
    description: `${DOCS} ${description}`,
    method: "GET",
    path,
    pathParams: opts?.pathParams,
    queryParams: opts?.queryParams,
  };
}

export function wmWrite(
  method: "POST" | "PUT" | "DELETE",
  name: string,
  path: string,
  description: string,
  opts?: {
    pathParams?: EndpointDef["pathParams"];
    queryParams?: EndpointDef["queryParams"];
    bodyParams?: EndpointDef["bodyParams"];
    withBody?: boolean;
  },
): EndpointDef {
  return {
    name,
    description: `${DOCS} ${description}`,
    method,
    path,
    pathParams: opts?.pathParams,
    queryParams: opts?.queryParams,
    bodyParams: opts?.bodyParams,
    bodyObject: opts?.withBody ?? method !== "DELETE",
  };
}
