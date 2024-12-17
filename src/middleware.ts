import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { getToken } from 'next-auth/jwt';
// Define paths that require protection
const protectedPaths = ['/home', '/admin', '/sample'];

export async function middleware(request: any) {
  const path = await request?.nextUrl?.pathname;

  // // Check if the current path starts with any of the protected paths
  const isProtectedPath = protectedPaths.some((prefix) =>
    path.startsWith(prefix),
  );

  if (isProtectedPath) {
    // Check authentication status
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

    // // If not authenticated, redirect to login
    if (!token) {
      const loginUrl = new URL('/api/auth/signin', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow access to non-protected paths or authenticated users
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!api/auth|_next|static|.*\\.[^/]*$).*)'],

};