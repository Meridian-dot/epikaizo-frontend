import type { NextConfig } from "next";

const apiUrl = (process.env.API_URL ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Same /api rewrite as the admin dashboard (Docking Spec section 2), for
  // any browser call that ever needs it. Server code calls API_URL directly.
  async rewrites() {
    return apiUrl
      ? [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }]
      : [];
  },
};

export default nextConfig;
