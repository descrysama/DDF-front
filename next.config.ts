import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
    ],
    // Strapi tourne en local en dev (localhost:1337, déjà restreint au pattern
    // ci-dessus) — Next bloque par défaut toute image dont l'hôte résout vers
    // une IP privée/loopback (protection SSRF). En prod, STRAPI_URL pointe
    // vers un hôte public donc ce flag n'a aucun effet.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
};

export default nextConfig;
