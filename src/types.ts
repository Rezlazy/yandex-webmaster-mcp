import { z, type ZodRawShape, type ZodTypeAny } from "zod";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface EndpointDef {
  name: string;
  description: string;
  method: HttpMethod;
  /** Path relative to API base, e.g. /user/{userId}/hosts */
  path: string;
  pathParams?: ZodRawShape;
  queryParams?: ZodRawShape;
  bodyParams?: ZodRawShape;
  /** Accept free-form `body` object as JSON request body */
  bodyObject?: boolean;
}

export const JsonValue: ZodTypeAny = z.any();

export const JsonObject = z.record(z.string(), z.any());

export function str(desc: string, optional = false) {
  const s = z.string().describe(desc);
  return optional ? s.optional() : s;
}

export function num(desc: string, optional = false) {
  const s = z.number().describe(desc);
  return optional ? s.optional() : s;
}

export function bool(desc: string, optional = false) {
  const s = z.boolean().describe(desc);
  return optional ? s.optional() : s;
}

export function enumStr<T extends [string, ...string[]]>(
  values: T,
  desc: string,
  optional = false,
) {
  const s = z.enum(values).describe(desc);
  return optional ? s.optional() : s;
}

export function obj(desc: string, optional = false) {
  const s = JsonObject.describe(desc);
  return optional ? s.optional() : s;
}
