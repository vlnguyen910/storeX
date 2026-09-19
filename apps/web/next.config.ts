import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@storex/shared", "@storex/contracts", "@storex/api-client"],
  reactStrictMode: true,
};

export default nextConfig;
