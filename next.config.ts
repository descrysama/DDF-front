import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const strapiUrl = new URL(process.env.STRAPI_URL ?? "http://localhost:1337");

const strapiRemotePattern: RemotePattern = {
  protocol: strapiUrl.protocol.replace(":", "") as "http" | "https",
  hostname: strapiUrl.hostname,
  ...(strapiUrl.port ? { port: strapiUrl.port } : {}),
  pathname: "/uploads/**",
};

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      strapiRemotePattern,
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;