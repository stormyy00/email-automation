import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./utils/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedRoutes = ["/user", "/admin"];

  const publicRoutes = ["/auth", "/"];

  const path = req.nextUrl.pathname;

  if (protectedRoutes.some((route) => path.startsWith(route)) && !session) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${req.nextUrl.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("OAuth Redirect Error:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }

    if (data.url) {
      return NextResponse.redirect(data.url);
    }
  }

  if (publicRoutes.includes(path) && session) {
    return NextResponse.redirect(new URL("/user", req.url));
  }

  if (path.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAdmin = user?.user_metadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
