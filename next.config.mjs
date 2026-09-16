import path from "node:path";
import { fileURLToPath } from "node:url";

const iconifyCjs = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "node_modules/@iconify/react/dist/iconify.cjs",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // The ESM build named-imports createElement, which webpack resolves against
  // React's react-server export map. The CJS build uses react.createElement.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@iconify/react": iconifyCjs,
    };
    return config;
  },
};

export default nextConfig;
