/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
