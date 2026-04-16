import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid workspace auto-detection on parent lockfiles.
    root: projectRoot,
  },
  output: 'standalone',
};

export default nextConfig;
