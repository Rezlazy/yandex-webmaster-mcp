export interface WebmasterConfig {
  token: string;
  apiUrl: string;
}

export function loadConfig(
  env: NodeJS.ProcessEnv = process.env,
): WebmasterConfig {
  const token = env.WEBMASTER_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "WEBMASTER_TOKEN is required (OAuth token with webmaster:hostinfo and webmaster:verify scopes)",
    );
  }

  return {
    token,
    apiUrl: (
      env.WEBMASTER_API_URL ?? "https://api.webmaster.yandex.net/v4"
    ).replace(/\/$/, ""),
  };
}
