import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Pakhi's Collection — Host & Subdomain Routing Middleware
 * Enables deploying the Admin Panel on a separate host/subdomain (e.g., admin.pakhiscollection.com)
 * and the Customer Storefront on the main domain (e.g., pakhiscollection.com), both linked to the same backend.
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // Skip Next.js internal chunks, static assets, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.jpg' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Handle CORS preflight & headers for API requests
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next();
    const origin = request.headers.get('origin');
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }
    return response;
  }

  // Detect whether this incoming request is targeted to the Admin host
  // Supports:
  // 1. Explicit deployment flag: APP_MODE=admin
  // 2. Completely distinct custom domain matching: ADMIN_HOST or NEXT_PUBLIC_ADMIN_URL (e.g. pakhis-admin.com)
  // 3. Subdomains: 'admin.pakhiscollection.com', 'admin.localhost:3000', or any host starting with 'admin.'
  const cleanHost = hostname.split(':')[0].toLowerCase();
  const configuredAdminHost = (process.env.ADMIN_HOST || process.env.ADMIN_DOMAIN || 'admin.').toLowerCase();
  
  let adminUrlHost = '';
  if (process.env.NEXT_PUBLIC_ADMIN_URL) {
    try {
      adminUrlHost = new URL(process.env.NEXT_PUBLIC_ADMIN_URL).hostname.toLowerCase();
    } catch {}
  }

  const isAdminHost =
    process.env.APP_MODE === 'admin' ||
    cleanHost.startsWith('admin.') ||
    cleanHost.startsWith('admin-') ||
    (adminUrlHost && cleanHost === adminUrlHost) ||
    (configuredAdminHost && cleanHost.includes(configuredAdminHost));

  // =========================================================================
  // HOST ROUTING 1: ADMIN HOST (admin.pakhiscollection.com or APP_MODE=admin)
  // =========================================================================
  if (isAdminHost) {
    // If accessing root '/' on the admin domain, seamlessly rewrite to the admin panel
    if (pathname === '/') {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }

    // Direct access to /admin passes through
    if (pathname === '/admin') {
      return NextResponse.next();
    }

    // Customer-only storefront routes return 404 on the admin host
    const customerOnlyPrefixes = [
      '/cart',
      '/checkout',
      '/wishlist',
      '/category',
      '/products',
      '/account',
      '/about',
      '/contact',
      '/faq',
      '/shipping-policy',
      '/returns-policy',
      '/privacy-policy',
      '/terms',
    ];

    if (customerOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      return new NextResponse('Not Found on Admin Terminal', { status: 404 });
    }

    return NextResponse.next();
  }

  // =========================================================================
  // HOST ROUTING 2: CUSTOMER STOREFRONT HOST (pakhiscollection.com)
  // =========================================================================
  // If APP_MODE is set to 'storefront', strictly isolate by blocking /admin access
  if (process.env.APP_MODE === 'storefront') {
    if (pathname.startsWith('/admin')) {
      const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
      if (adminUrl) {
        // Redirect administrative staff to their designated separate host
        return NextResponse.redirect(new URL(adminUrl));
      }
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
