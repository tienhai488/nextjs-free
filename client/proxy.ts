import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privateRoutes = ['/me', '/products/create']
const publicRoutes = ['/login', '/register']
const productEditPageRegex = /^\/products\/\d+\/edit$/

const isPrivateRoute = (pathname: string): boolean => {
  return privateRoutes.some((route) => pathname.startsWith(route))
}

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => pathname.startsWith(route))
}

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value || ''
  const { pathname } = request.nextUrl

  if (isPrivateRoute(pathname) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isPublicRoute(pathname) && sessionToken) {
    return NextResponse.redirect(new URL('/me', request.url))
  }

  if (productEditPageRegex.test(pathname) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/register', '/me', '/products/create', '/products/:path*']
}
