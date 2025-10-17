import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  // Assuming your app is hosted at 'yourapp.com'
  // and tenants are at 'tenant.yourapp.com'.
  // For local dev, you'll use 'tenant.localhost:3000'.
  const subdomain = hostname?.split('.')[0];

  // Pass the subdomain as a header.
  // This header can be read in your API routes and server components.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', subdomain || '');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Define which paths the middleware should run on.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*', // Run on all API routes as well
  ],
};