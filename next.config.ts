import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.razorpay.com;
  frame-src 'self' https://api.razorpay.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://api.razorpay.com")',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
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
