import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static copy for GitHub Pages (served under NEXT_PUBLIC_BASE_PATH).
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStatic
  ? { output: "export", basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined, trailingSlash: true }
  : { output: "standalone" };

export default nextConfig;
