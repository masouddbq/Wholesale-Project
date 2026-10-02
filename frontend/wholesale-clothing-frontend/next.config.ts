import path from "path";
import type { NextConfig } from "next";

const backendHost = process.env.BACKEND_HOST || "localhost";
const backendPort = process.env.BACKEND_PORT || "5001";
const appRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  distDir: "next-build",
  output: "standalone",
  outputFileTracingRoot: appRoot,
  turbopack: {
    root: appRoot,
  },
  async redirects() {
    return [
      {
        source: "/wholesale-guide",
        destination: "/guide",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiOrigin = `http://127.0.0.1:${backendPort}`;

    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${apiOrigin}/uploads/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: backendHost,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
