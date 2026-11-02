import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static copy for GitHub Pages (served under NEXT_PUBLIC_BASE_PATH).
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Photos are already compressed JPGs; skipping the optimizer keeps next/image working in the static export.
  images: { unoptimized: true },
  ...(isStatic
    ? { output: "export" as const, basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined, trailingSlash: true }
    : { output: "standalone" as const }),
};

export default nextConfig;
