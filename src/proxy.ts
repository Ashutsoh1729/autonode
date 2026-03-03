import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // If user is authenticated and visits the root URL, redirect to /workflows
    if (sessionCookie && pathname === "/") {
        return NextResponse.redirect(new URL("/workflows", request.url));
    }

    // If user is NOT authenticated and tries to access a protected route, redirect to /sign-in
    if (!sessionCookie && pathname !== "/") {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Otherwise, let the request through
    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/workflows/:path*", "/executions/:path*", "/credentials/:path*"],
};
