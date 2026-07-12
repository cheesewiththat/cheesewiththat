import type { NextConfig } from "next";

const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
let remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (mediaBase) {
  try {
    const url = new URL(mediaBase);
    if (url.protocol === "https:") {
      remotePatterns = [
        {
          protocol: "https",
          hostname: url.hostname,
          pathname: `${url.pathname.replace(/\/$/, "")}/**`,
        },
      ];
    }
  } catch {
    // Invalid configuration is ignored; local assets remain available.
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { remotePatterns },
};

export default nextConfig;
