import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const role = req.cookies.get('role')?.value;

  const { pathname } = req.nextUrl;

  // ✅ If not logged in and trying to access protected routes
  if (!token && (pathname.startsWith('/Jobs') || pathname.startsWith('/recruiter'))) {
    const loginUrl = new URL('/', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ If applicant tries to access recruiter page
  if (pathname.startsWith('/recruiter') && role !== 'recruiter') {
    const url = new URL('/unauthorized', req.url);
    url.searchParams.set('message', 'User is applicant, not recruiter');
    return NextResponse.redirect(url);
  }

  // ✅ If recruiter tries to access applicant page
  if (pathname.startsWith('/Jobs') && role !== 'applicant') {
    const url = new URL('/unauthorized', req.url);
    url.searchParams.set('message', 'User is recruiter, not applicant');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Jobs/:path*', '/recruiter/:path*'],
};
