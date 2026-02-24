import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,        // ⭐ ADD YE
  },
  typescript: {
    ignoreBuildErrors: true,         // ⭐ ADD YE  
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'process.env.NEXT_PUBLIC_API_URL'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

