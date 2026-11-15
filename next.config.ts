import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendUrl = process.env.RENDER_BACKEND_URL;
    if (!backendUrl) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${backendUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
