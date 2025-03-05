import { NextRequest, NextResponse } from 'next/server';

// TODO: token no cookie nao esta funcionando
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/register' || path === '/forgot-password';
  
  const token = request.cookies.get('auth-storage')?.value ?? 'aa'
  
  if (!isPublicPath && !token) {
    console.log('!isPublicPath && !token')
    return NextResponse.redirect(new URL('/login', request.nextUrl.origin));
  }
  
  if (isPublicPath && token) {
    try {
      const authData = JSON.parse(token);
      if (authData.state && authData.state.isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl.origin));
      }
    } catch (error) {
      // TODO: Handle error
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
