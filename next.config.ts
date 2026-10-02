import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/category/all',
        permanent: true,
      },
      {
        source: '/product/:slug',
        destination: '/products/:slug',
        permanent: true,
      },
      {
        source: '/policies/shipping',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/policies/returns',
        destination: '/returns-policy',
        permanent: true,
      },
      {
        source: '/policies/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/policies/terms',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/orders/:id',
        destination: '/track-order?orderId=:id',
        permanent: false,
      },
      {
        source: '/returns',
        destination: '/returns-policy',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
