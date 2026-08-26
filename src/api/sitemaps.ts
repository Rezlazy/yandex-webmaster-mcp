import type { EndpointDef } from "../types.js";
import { pathHost, pathSitemap, wmGet, wmWrite } from "./helpers.js";

export const sitemapEndpoints: EndpointDef[] = [
  wmGet(
    "wm_sitemaps_list",
    "/user/{userId}/hosts/{hostId}/sitemaps",
    "List discovered Sitemap files",
    { pathParams: pathHost },
  ),
  wmGet(
    "wm_sitemap_get",
    "/user/{userId}/hosts/{hostId}/sitemaps/{sitemapId}",
    "Get details of a discovered Sitemap",
    { pathParams: pathSitemap },
  ),
  wmGet(
    "wm_user_sitemaps_list",
    "/user/{userId}/hosts/{hostId}/user-added-sitemaps",
    "List user-added Sitemap files",
    { pathParams: pathHost },
  ),
  wmWrite(
    "POST",
    "wm_user_sitemap_add",
    "/user/{userId}/hosts/{hostId}/user-added-sitemaps",
    "Add a Sitemap URL. Body: {\"url\": \"https://example.com/sitemap.xml\"}",
    { pathParams: pathHost, withBody: true },
  ),
  wmGet(
    "wm_user_sitemap_get",
    "/user/{userId}/hosts/{hostId}/user-added-sitemaps/{sitemapId}",
    "Get details of a user-added Sitemap",
    { pathParams: pathSitemap },
  ),
  wmWrite(
    "DELETE",
    "wm_user_sitemap_delete",
    "/user/{userId}/hosts/{hostId}/user-added-sitemaps/{sitemapId}",
    "Delete a user-added Sitemap",
    { pathParams: pathSitemap, withBody: false },
  ),
];
