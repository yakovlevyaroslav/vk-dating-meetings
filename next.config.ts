import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
