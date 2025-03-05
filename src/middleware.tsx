import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const supabase = createClient();

  const protectedRoutes = ["/user", "/admin"];
  const publicRoutes = ["/auth", "/"];

  if (
    protectedRoutes.some((route) => path.startsWith(route)) &&
    publicRoutes.some((route) => path.startsWith(route))
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (path.startsWith("/admins")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdmin = user?.user_metadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Proceed with the request if no issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
