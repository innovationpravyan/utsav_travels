import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // TypeScript build ignores (only for development convenience)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint build ignores (only for development convenience)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image domain configuration for next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
