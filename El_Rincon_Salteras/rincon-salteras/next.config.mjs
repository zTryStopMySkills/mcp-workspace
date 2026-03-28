/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Permite que la API route escriba en el filesystem
  experimental: {
    serverComponentsExternalPackages: ['fs'],
  },
};

export default nextConfig;
