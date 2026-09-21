import type { NextConfig } from "next";

const backendHost = process.env.BACKEND_HOST || "localhost";

const nextConfig: NextConfig = {
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
