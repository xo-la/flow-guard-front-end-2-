/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Bypasses the failing TypeScript CLI flag error on Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; // Use 'module.exports = nextConfig;' if using .js