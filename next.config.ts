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
};

export default nextConfig;
