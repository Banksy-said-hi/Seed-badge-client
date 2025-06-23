/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', 
  distDir: './dist', 
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser.js',
    };
    return config;
  },
}

export default nextConfig 