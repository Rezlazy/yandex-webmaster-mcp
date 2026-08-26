import type { EndpointDef } from "../types.js";
import { webmasterEndpoints } from "./index.js";

export const catalog: EndpointDef[] = [...webmasterEndpoints];

export function assertUniqueToolNames(defs: EndpointDef[] = catalog): void {
  const seen = new Set<string>();
  for (const def of defs) {
    if (seen.has(def.name)) {
      throw new Error(`Duplicate tool name: ${def.name}`);
    }
    seen.add(def.name);
  }
}
