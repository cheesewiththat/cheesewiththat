export function isLocalMediaPath(path: string) {
  return path.startsWith("/") && !path.startsWith("//");
}

export function resolveMediaPath(
  path: string,
  base = process.env.NEXT_PUBLIC_MEDIA_BASE_URL,
) {
  if (isLocalMediaPath(path)) return path;
  if (!base) return path;
  try {
    const baseUrl = new URL(base.endsWith("/") ? base : `${base}/`);
    if (baseUrl.protocol !== "https:") return path;
    const resolved = new URL(path.replace(/^\//, ""), baseUrl);
    if (
      resolved.origin !== baseUrl.origin ||
      !resolved.pathname.startsWith(baseUrl.pathname)
    )
      return path;
    return resolved.toString();
  } catch {
    return path;
  }
}
