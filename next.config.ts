import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'css.tgb.cn',
        port: '',
        pathname: '/images/face/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // For avatar fallbacks
      },
    ],
  },
}

export default nextConfig
