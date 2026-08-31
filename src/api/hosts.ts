import type { EndpointDef } from "../types.js";
import { str } from "../types.js";
import {
  pathHost,
  pathUserId,
  qDateRange,
  qVerificationType,
  wmGet,
  wmWrite,
} from "./helpers.js";

export const hostEndpoints: EndpointDef[] = [
  wmGet(
    "wm_hosts_list",
    "/user/{userId}/hosts",
    "List sites added by the user",
    { pathParams: pathUserId },
  ),
  wmWrite(
    "POST",
    "wm_host_add",
    "/user/{userId}/hosts",
    "Add a site. Body: {\"host_url\": \"https://example.com\"}",
    { pathParams: pathUserId, withBody: true },
  ),
  wmGet(
    "wm_host_get",
    "/user/{userId}/hosts/{hostId}",
    "Get site details",
    { pathParams: pathHost },
  ),
  wmWrite(
    "DELETE",
    "wm_host_delete",
    "/user/{userId}/hosts/{hostId}",
    "Remove a site from the account",
    { pathParams: pathHost, withBody: false },
  ),
  wmGet(
    "wm_host_summary",
    "/user/{userId}/hosts/{hostId}/summary",
    "Get site summary statistics",
    { pathParams: pathHost },
  ),
  wmGet(
    "wm_owners_list",
    "/user/{userId}/hosts/{hostId}/owners",
    "List users who verified ownership of the site",
    { pathParams: pathHost },
  ),
  wmGet(
    "wm_sqi_history",
    "/user/{userId}/hosts/{hostId}/sqi-history",
    "Get SQI (site quality index) change history",
    {
      pathParams: pathHost,
      queryParams: qDateRange,
    },
  ),
];

export const verificationEndpoints: EndpointDef[] = [
  wmGet(
    "wm_verification_get",
    "/user/{userId}/hosts/{hostId}/verification",
    "Get site verification status and methods",
    { pathParams: pathHost },
  ),
  wmWrite(
    "POST",
    "wm_verification_start",
    "/user/{userId}/hosts/{hostId}/verification",
    "Start site ownership verification. Required query: verification_type (META_TAG, HTML_FILE, or DNS)",
    {
      pathParams: pathHost,
      queryParams: { verification_type: qVerificationType },
      withBody: false,
    },
  ),
];

export const importantUrlsEndpoints: EndpointDef[] = [
  wmGet(
    "wm_important_urls",
    "/user/{userId}/hosts/{hostId}/important-urls",
    "Monitor important pages status",
    { pathParams: pathHost },
  ),
  wmGet(
    "wm_important_urls_history",
    "/user/{userId}/hosts/{hostId}/important-urls/history",
    "Get change history for an important page",
    {
      pathParams: pathHost,
      queryParams: {
        url: str("Page URL to get history for"),
        ...qDateRange,
      },
    },
  ),
];

export const diagnosticsEndpoints: EndpointDef[] = [
  wmGet(
    "wm_diagnostics",
    "/user/{userId}/hosts/{hostId}/diagnostics",
    "Get site diagnostics (problems and recommendations)",
    { pathParams: pathHost },
  ),
];
