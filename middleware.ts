import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isOnboardingRoute = createRouteMatcher(['/onboarding'])
const isProtectedRoute = createRouteMatcher([
  '/',
  '/following',
  '/bookmarks',
  '/communities(.*)',
  '/compose(.*)',
  '/notifications(.*)',
  '/profile(.*)',
  '/search',
  '/tweets(.*)',
])

const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims } = await auth()
  const onboarded = sessionClaims?.metadata?.onboardingComplete

  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  if (!userId && !onboarded && isOnboardingRoute(req)) {
    const signinUrl = new URL('/sign-in', req.url)
    return NextResponse.redirect(signinUrl)
  }

  if (userId && !onboarded && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  if (userId && !onboarded) {
    const onboardingUrl = new URL('/onboarding', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if(userId && onboarded && isAuthRoute(req)) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if(userId && onboarded && !isAuthRoute(req)) {
    return NextResponse.next()
  }

  if(userId && onboarded && isProtectedRoute(req)) {
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
