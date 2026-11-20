export function backendApiUrl(path: string, query?: URLSearchParams) {
  const configuredUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!configuredUrl) throw new Error("Backend API URL is not configured");

  const base = new URL(configuredUrl);
  if (!["http:", "https:"].includes(base.protocol)) {
    throw new Error("Backend API URL must use HTTP or HTTPS");
  }

  const prefix = base.pathname.replace(/\/+$/, "") || "/api/v1";
  base.pathname = prefix + path;
  base.search = query?.toString() ?? "";
  base.hash = "";
  return base;
}
