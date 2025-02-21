// Fichier middleware.ts 

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

 export function middleware(request: NextRequest) {
//   // Get the pathname of the request (e.g. /, /protected, /protected/123)
//   // const path = request.nextUrl.pathname;

//   // Public paths that don't require authentication
//   // const isPublicPath = path === '/auth/login' || 
//   //                     path === '/auth/register' || 
//   //                     path === '/auth/forgot-password' ||
//   //                     path.startsWith('/auth/reset-password/') ||
//   //                     path.startsWith('/auth/verify-email/') ||
//   //                     path === '/';

//   // Check if the user is authenticated
//   // const token = request.cookies.get('token')?.value;

//   // If the user is on a public path and authenticated, redirect to dashboard
//   // if (isPublicPath && token) {
//   //   return NextResponse.redirect(new URL('/dashboard', request.url));
//   // }

//   // If the user is not authenticated and trying to access a protected route
//   // if (!isPublicPath && !token) {
//   //   return NextResponse.redirect(new URL('/auth/login', request.url));
//   // }

//   // return NextResponse.next();
// }

// Configure the paths that middleware will run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * 1. /api (API routes)
//      * 2. /_next (Next.js internals)
//      * 3. /fonts (inside public directory)
//      * 4. /favicon.ico (favicon file)
//      */
//     '/((?!api|_next|fonts|favicon.ico).*)',
//   ],
 };
