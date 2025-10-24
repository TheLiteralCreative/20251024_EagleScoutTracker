import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";

import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "session_token";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function createSession(userId: string, response: NextResponse) {
  const rawToken = randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.session.create({
    data: {
      userId,
      sessionToken: hashedToken,
      expires,
    },
  });

  response.cookies.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    expires,
    path: "/",
  });
}

export async function invalidateSession(response: NextResponse) {
  const cookieJar = await cookies();
  const sessionCookie = cookieJar.get(SESSION_COOKIE);
  if (!sessionCookie) {
    response.cookies.delete(SESSION_COOKIE);
    return;
  }

  const hashed = hashToken(sessionCookie.value);
  await prisma.session.deleteMany({
    where: { sessionToken: hashed },
  });

  response.cookies.delete(SESSION_COOKIE);
}

export async function getCurrentSession() {
  const cookieJar = await cookies();
  const sessionCookie = cookieJar.get(SESSION_COOKIE);
  if (!sessionCookie) {
    return null;
  }

  const hashed = hashToken(sessionCookie.value);
  const session = await prisma.session.findUnique({
    where: { sessionToken: hashed },
    include: { user: true },
  });

  if (!session) {
    cookieJar.delete(SESSION_COOKIE);
    return null;
  }

  if (session.expires < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieJar.delete(SESSION_COOKIE);
    return null;
  }

  return session;
}

export async function requireUser({ roles }: { roles?: string[] } = {}) {
  const session = await getCurrentSession();
  if (!session) {
    return null;
  }

  if (roles && session.user.role && !roles.includes(session.user.role)) {
    return null;
  }

  return session.user;
}
