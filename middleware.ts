import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/onboarding(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth()
  const onboarded = sessionClaims?.metadata?.onboardingComplete
  const path = req.nextUrl.pathname

  // Unauthenticated → not a public page → redirect to sign‑in
  if (!userId && !isPublicRoute(req))
    return redirectToSignIn({ returnBackUrl: req.url })

  // Authenticated but not onboarded → not on onboarding page → redirect there
  if (userId && !onboarded && path !== '/onboarding')
    return NextResponse.redirect(new URL('/onboarding', req.url))

  // Authenticated & onboarded → trying to visit auth pages → send to home
  if (userId && onboarded && isPublicRoute(req))
    return NextResponse.redirect(new URL('/', req.url))

  // All other cases — allow through
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
