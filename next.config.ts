import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  // Takumi ships a native binding; keep it out of the bundle so standalone tracing copies the .node file.
  serverExternalPackages: ["takumi-js", "@takumi-rs/core"],
  // Fonts are read from disk at runtime, so the tracer cannot see them.
  outputFileTracingIncludes: {
    "/api/og/[id]": ["./assets/fonts/**/*"],
    "/opengraph-image": ["./assets/fonts/**/*"],
    "/twitter-image": ["./assets/fonts/**/*"],
  },
  // PostHog reverse proxy (US cloud). The static/array rules must precede the catch-all.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog capture endpoints end in a slash; don't redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
