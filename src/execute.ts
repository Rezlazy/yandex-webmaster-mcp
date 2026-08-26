import { z } from "zod";
import type { EndpointDef } from "./types.js";
import { substitutePath, type WebmasterClient } from "./client.js";

function collectKeys(shape?: Record<string, unknown>): string[] {
  return shape ? Object.keys(shape) : [];
}

export function buildZodShape(def: EndpointDef): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {};

  if (def.pathParams) Object.assign(shape, def.pathParams);
  if (def.queryParams) Object.assign(shape, def.queryParams);
  if (def.bodyParams) Object.assign(shape, def.bodyParams);
  if (def.bodyObject) {
    shape.body = z
      .record(z.string(), z.any())
      .describe(
        "JSON request body. For POST use the structure from API docs (e.g. {\"host_url\": \"https://example.com\"}).",
      );
  }

  return shape;
}

export async function executeEndpoint(
  client: WebmasterClient,
  def: EndpointDef,
  args: Record<string, unknown>,
): Promise<unknown> {
  const pathKeys = collectKeys(def.pathParams);
  const queryKeys = collectKeys(def.queryParams);
  const bodyKeys = collectKeys(def.bodyParams);

  const pathParams: Record<string, unknown> = {};
  for (const k of pathKeys) {
    pathParams[k] = args[k];
  }

  const query: Record<string, unknown> = {};
  for (const k of queryKeys) {
    if (args[k] !== undefined) query[k] = args[k];
  }

  const path = substitutePath(def.path, pathParams);

  const named: Record<string, unknown> = {};
  for (const k of bodyKeys) {
    if (args[k] !== undefined) named[k] = args[k];
  }
  const extra =
    def.bodyObject && args.body && typeof args.body === "object"
      ? (args.body as Record<string, unknown>)
      : {};
  const merged = { ...named, ...extra };

  let body: unknown = undefined;
  const wantsBody =
    Object.keys(merged).length > 0 ||
    def.bodyObject ||
    Boolean(def.bodyParams) ||
    def.method === "POST";

  if (
    wantsBody &&
    (Object.keys(merged).length > 0 || def.method === "POST")
  ) {
    if (Object.keys(merged).length > 0) {
      body = merged;
    } else if (def.method === "POST") {
      body = {};
    }
  }

  if (def.method === "DELETE" && Object.keys(merged).length > 0) {
    body = merged;
  }

  return client.request({
    method: def.method,
    path,
    query: Object.keys(query).length ? query : undefined,
    body,
  });
}
