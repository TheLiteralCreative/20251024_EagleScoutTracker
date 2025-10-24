import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hashToken } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const PUBLIC_PATHS = ["/login", "/api/login", "/api/logout", "/_next", "/api/health"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get("session_token");

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const hashed = hashToken(sessionToken.value);
  const session = await prisma.session.findUnique({
    where: { sessionToken: hashed },
    include: { user: true },
  });

  if (!session || session.expires < new Date()) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session_token");
    return response;
  }

  if (pathname.startsWith("/leader") && session.user.role !== "LEADER") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/" && session.user.role === "LEADER") {
    return NextResponse.redirect(new URL("/leader", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
