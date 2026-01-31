/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Skip type checking during build (hackathon mode)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Add empty turbopack config to silence warning
  turbopack: {},
  
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
