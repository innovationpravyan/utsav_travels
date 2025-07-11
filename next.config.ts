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
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'keg8uji58siagch9.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optional: Add image optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;