import type { HttpMethod } from "./types.js";
import type { WebmasterConfig } from "./config.js";

export class WebmasterApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly method: string,
    readonly url: string,
    readonly body: unknown,
  ) {
    super(message);
    this.name = "WebmasterApiError";
  }
}

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
}

function buildQuery(query?: Record<string, unknown>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, String(item));
      }
    } else {
      params.set(key, String(value));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

function formatErrorBody(parsed: unknown, text: string, statusText: string): string {
  if (typeof parsed === "object" && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    if ("error_code" in obj || "error_message" in obj) {
      return JSON.stringify(parsed);
    }
  }
  return text || statusText;
}

export function substitutePath(
  template: string,
  params: Record<string, unknown>,
): string {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

export class WebmasterClient {
  constructor(
    private readonly config: WebmasterConfig,
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  private authHeader(): string {
    return `OAuth ${this.config.token}`;
  }

  async request<T = unknown>(options: RequestOptions): Promise<T> {
    const path = options.path.startsWith("/")
      ? options.path
      : `/${options.path}`;
    const url = `${this.config.apiUrl}${path}${buildQuery(options.query)}`;

    const headers: Record<string, string> = {
      Authorization: this.authHeader(),
      Accept: "application/json",
    };

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      headers["Content-Type"] = "application/json; charset=UTF-8";
      body = JSON.stringify(options.body);
    }

    const res = await this.fetchFn(url, {
      method: options.method,
      headers,
      body,
    });

    const text = await res.text();

    let parsed: unknown = null;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }
    }

    if (!res.ok) {
      const msg = formatErrorBody(parsed, text, res.statusText);
      throw new WebmasterApiError(
        `Webmaster API ${options.method} ${url} → ${res.status}: ${msg}`,
        res.status,
        options.method,
        url,
        parsed,
      );
    }

    if (res.status === 204 || text === "") {
      return null as T;
    }
    return parsed as T;
  }
}
