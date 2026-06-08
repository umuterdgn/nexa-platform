import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Yalnızca korumalı rotalarda çalışır.
 * Ana sayfa, hizmetler, ürünler vb. public — middleware'e girmez.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const login = new URL("/auth/login", request.url);
      login.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(login);
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/profil", request.url));
    }
  }

  if (pathname.startsWith("/profil") && !token) {
    const login = new URL("/auth/login", request.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profil/:path*"],
};
