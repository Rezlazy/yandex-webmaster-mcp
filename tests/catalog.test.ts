import { describe, expect, it, vi } from "vitest";
import { catalog, assertUniqueToolNames } from "../src/api/catalog.js";
import {
  WebmasterClient,
  WebmasterApiError,
  substitutePath,
} from "../src/client.js";
import { executeEndpoint, buildZodShape } from "../src/execute.js";
import { loadConfig } from "../src/config.js";

describe("catalog", () => {
  it("has unique tool names", () => {
    expect(() => assertUniqueToolNames()).not.toThrow();
  });

  it("covers all webmaster API endpoints", () => {
    expect(catalog.length).toBe(42);
  });

  it("every endpoint uses /v4 paths via api base", () => {
    for (const def of catalog) {
      expect(def.path.startsWith("/user") || def.path === "/user").toBe(true);
    }
  });

  it("path params in template have matching schema", () => {
    for (const def of catalog) {
      const matches = [...def.path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
      for (const key of matches) {
        expect(
          def.pathParams?.[key],
          `${def.name} missing pathParam ${key}`,
        ).toBeDefined();
      }
    }
  });

  it("POST endpoints accept body", () => {
    const writers = catalog.filter((d) => d.method === "POST");
    for (const def of writers) {
      if (def.name === "wm_verification_start") continue;
      expect(def.bodyObject, def.name).toBe(true);
    }
  });

  it("wm_verification_start requires verification_type query param", () => {
    const def = catalog.find((d) => d.name === "wm_verification_start")!;
    const shape = buildZodShape(def);
    expect(shape.verification_type).toBeDefined();
    expect(def.bodyObject).toBe(false);
  });

  it("wm_search_queries_popular requires order_by", () => {
    const def = catalog.find((d) => d.name === "wm_search_queries_popular")!;
    const shape = buildZodShape(def);
    expect(shape.order_by).toBeDefined();
  });
});

describe("substitutePath", () => {
  it("encodes path segments", () => {
    expect(
      substitutePath("/user/{userId}/hosts/{hostId}", {
        userId: 1,
        hostId: "https:example.com:443",
      }),
    ).toBe("/user/1/hosts/https%3Aexample.com%3A443");
  });

  it("throws on missing params", () => {
    expect(() =>
      substitutePath("/user/{userId}/hosts", {}),
    ).toThrow(/Missing/);
  });
});

describe("loadConfig", () => {
  it("requires WEBMASTER_TOKEN", () => {
    expect(() => loadConfig({})).toThrow(/WEBMASTER_TOKEN/);
  });

  it("loads config with defaults", () => {
    const c = loadConfig({ WEBMASTER_TOKEN: "oauth-token" });
    expect(c.token).toBe("oauth-token");
    expect(c.apiUrl).toBe("https://api.webmaster.yandex.net/v4");
  });
});

describe("WebmasterClient", () => {
  it("maps non-ok responses to WebmasterApiError", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            error_code: "INVALID_USER_ID",
            error_message: "Invalid user id",
          }),
          {
            status: 403,
            headers: { "Content-Type": "application/json" },
          },
        ),
    );
    const client = new WebmasterClient(
      { token: "t", apiUrl: "https://api.webmaster.yandex.net/v4" },
      fetchFn as unknown as typeof fetch,
    );

    await expect(
      client.request({ method: "GET", path: "/user" }),
    ).rejects.toBeInstanceOf(WebmasterApiError);
  });

  it("sends OAuth header and JSON body on POST", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify({ host_id: "https:example.com:443" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
    );
    const client = new WebmasterClient(
      { token: "my-token", apiUrl: "https://api.webmaster.yandex.net/v4" },
      fetchFn as unknown as typeof fetch,
    );
    await client.request({
      method: "POST",
      path: "/user/1/hosts",
      body: { host_url: "https://example.com" },
    });
    const call = fetchFn.mock.calls[0] as unknown as [
      string,
      { method?: string; headers?: Record<string, string>; body?: string },
    ];
    expect(call[1]?.method).toBe("POST");
    expect(call[1]?.headers?.Authorization).toBe("OAuth my-token");
    expect(call[1]?.headers?.["Content-Type"]).toBe(
      "application/json; charset=UTF-8",
    );
    expect(JSON.parse(String(call[1]?.body))).toEqual({
      host_url: "https://example.com",
    });
  });
});

describe("executeEndpoint", () => {
  it("builds hosts list query", async () => {
    const fetchFn = vi.fn(
      async () => new Response(JSON.stringify({ hosts: [] }), { status: 200 }),
    );
    const client = new WebmasterClient(
      { token: "t", apiUrl: "https://api.webmaster.yandex.net/v4" },
      fetchFn as unknown as typeof fetch,
    );

    const def = catalog.find((d) => d.name === "wm_hosts_list")!;
    await executeEndpoint(client, def, { userId: 42 });

    const call = fetchFn.mock.calls[0] as unknown as [string];
    expect(String(call[0])).toBe(
      "https://api.webmaster.yandex.net/v4/user/42/hosts",
    );
  });

  it("substitutes path and sends body on host add", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(JSON.stringify({ host_id: "https:example.com:443" }), {
          status: 201,
        }),
    );
    const client = new WebmasterClient(
      { token: "t", apiUrl: "https://api.webmaster.yandex.net/v4" },
      fetchFn as unknown as typeof fetch,
    );

    const def = catalog.find((d) => d.name === "wm_host_add")!;
    await executeEndpoint(client, def, {
      userId: 1,
      body: { host_url: "https://example.com" },
    });

    const call = fetchFn.mock.calls[0] as unknown as [
      string,
      { method?: string; body?: string },
    ];
    expect(String(call[0])).toContain("/user/1/hosts");
    expect(call[1]?.method).toBe("POST");
    expect(JSON.parse(String(call[1]?.body))).toEqual({
      host_url: "https://example.com",
    });
  });

  it("sends verification_type as query param on verification start", async () => {
    const fetchFn = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            verification_state: "IN_PROGRESS",
            verification_type: "META_TAG",
          }),
          { status: 200 },
        ),
    );
    const client = new WebmasterClient(
      { token: "t", apiUrl: "https://api.webmaster.yandex.net/v4" },
      fetchFn as unknown as typeof fetch,
    );

    const def = catalog.find((d) => d.name === "wm_verification_start")!;
    await executeEndpoint(client, def, {
      userId: 1,
      hostId: "https:example.com:443",
      verification_type: "META_TAG",
    });

    const call = fetchFn.mock.calls[0] as unknown as [string];
    expect(String(call[0])).toContain(
      "/user/1/hosts/https%3Aexample.com%3A443/verification?",
    );
    expect(String(call[0])).toContain("verification_type=META_TAG");
  });
});
