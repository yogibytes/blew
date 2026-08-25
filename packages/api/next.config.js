/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: true,
  },
  images: {
    unoptimized: true,
  },
  crossOrigin: "anonymous"
}

module.exports = nextConfig

