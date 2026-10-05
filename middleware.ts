import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const needsSession = createRouteMatcher(['/profile(.*)','/settings(.*)','/messages(.*)','/discussion/new','/discussion/drafts(.*)','/discussion/review(.*)','/discussion/revise(.*)','/discussion/groups/new']);
export default clerkMiddleware(async (auth, request) => {
  if(needsSession(request) && !(await auth()).userId){
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect_url',request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
});

export const config = {
    matcher: [
        // Bỏ qua các file tĩnh và file hệ thống của Next.js
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Luôn chạy middleware cho các API routes
        '/(api|trpc)(.*)',
    ],
};