/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'graceful-desk-d8df9cd973.strapiapp.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'graceful-desk-d8df9cd973.media.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
