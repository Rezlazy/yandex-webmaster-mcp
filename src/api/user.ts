import type { EndpointDef } from "../types.js";
import { wmGet } from "./helpers.js";

export const userEndpoints: EndpointDef[] = [
  wmGet("wm_user_get", "/user", "Get current user ID (required for all other calls)"),
];
