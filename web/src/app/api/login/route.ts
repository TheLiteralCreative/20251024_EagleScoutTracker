import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const email = body.email.trim().toLowerCase();
  const password = body.password;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  await createSession(user.id, response);

  return response;
}
