import type { EndpointDef } from "../types.js";
import {
  diagnosticsEndpoints,
  hostEndpoints,
  importantUrlsEndpoints,
  verificationEndpoints,
} from "./hosts.js";
import { sitemapEndpoints } from "./sitemaps.js";
import { searchQueryEndpoints } from "./search-queries.js";
import {
  indexingEndpoints,
  linksEndpoints,
  recrawlEndpoints,
} from "./indexing.js";
import { feedsEndpoints } from "./feeds.js";
import { userEndpoints } from "./user.js";

export const webmasterEndpoints: EndpointDef[] = [
  ...userEndpoints,
  ...hostEndpoints,
  ...verificationEndpoints,
  ...importantUrlsEndpoints,
  ...diagnosticsEndpoints,
  ...sitemapEndpoints,
  ...searchQueryEndpoints,
  ...recrawlEndpoints,
  ...indexingEndpoints,
  ...linksEndpoints,
  ...feedsEndpoints,
];
