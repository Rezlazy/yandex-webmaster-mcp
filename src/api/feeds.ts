import type { EndpointDef } from "../types.js";
import { pathHost, wmGet, wmWrite } from "./helpers.js";

export const feedsEndpoints: EndpointDef[] = [
  wmGet(
    "wm_feeds_list",
    "/user/{userId}/hosts/{hostId}/feeds/list",
    "List uploaded feeds",
    { pathParams: pathHost },
  ),
  wmWrite(
    "POST",
    "wm_feeds_add_start",
    "/user/{userId}/hosts/{hostId}/feeds/add/start",
    "Start async feed upload. Body: see API docs for feed structure",
    { pathParams: pathHost, withBody: true },
  ),
  wmGet(
    "wm_feeds_add_info",
    "/user/{userId}/hosts/{hostId}/feeds/add/info",
    "Get async feed upload status",
    { pathParams: pathHost },
  ),
  wmWrite(
    "POST",
    "wm_feeds_batch_add",
    "/user/{userId}/hosts/{hostId}/feeds/batch/add",
    "Upload multiple feeds. Body: see API docs",
    { pathParams: pathHost, withBody: true },
  ),
  wmWrite(
    "DELETE",
    "wm_feeds_batch_remove",
    "/user/{userId}/hosts/{hostId}/feeds/batch/remove",
    "Remove multiple feeds. Body: see API docs",
    { pathParams: pathHost, withBody: true },
  ),
];
