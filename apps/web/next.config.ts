import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@storex/shared"],
  reactStrictMode: true,
};

export default nextConfig;
