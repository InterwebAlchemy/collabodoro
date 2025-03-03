import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  env: {
    NEXT_PUBLIC_APPLICATION_URL: process.env.NEXT_PUBLIC_APPLICATION_URL,
  },
};

export default nextConfig;
