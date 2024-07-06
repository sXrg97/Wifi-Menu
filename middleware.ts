import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

//Clerk Middleware

const isPublicRoute = createRouteMatcher(["/", "/menu/:id", "/sign-in", "/sign-up"]);

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) {
    return; // If it's a public route, do nothing (allow access)
  }
  // For any other route, require authentication
  auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};