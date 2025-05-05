import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname;

  const isAuth = !!token;
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtectedRoute = pathname.startsWith('/users');

  if (isProtectedRoute && !isAuth) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL('/users', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/users/:path*'],
};
