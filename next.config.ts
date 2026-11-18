import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a static copy for GitHub Pages (served under NEXT_PUBLIC_BASE_PATH).
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Photos are already compressed JPGs; skipping the optimizer keeps next/image working in the static export.
  images: { unoptimized: true },
  // photos are shrunk in the browser first (src/app/admin/shrink.ts); Vercel refuses bodies over 4.5MB anyway
  experimental: { serverActions: { bodySizeLimit: "4mb" } },
  // the first Vercel address showed the same pages as the real domain; send it there for good
  ...(isStatic ? {} : { redirects: async () => [{ source: "/:path*", has: [{ type: "host" as const, value: "injeong-demo.vercel.app" }], destination: "https://www.injeongcon.co.kr/:path*", permanent: true }] }),
  ...(isStatic
    ? { output: "export" as const, basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined, trailingSlash: true }
    : { output: "standalone" as const }),
};

export default nextConfig;
