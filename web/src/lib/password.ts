import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const DELIMITER = ":";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}${DELIMITER}${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored.includes(DELIMITER)) {
    return false;
  }

  const [salt, derived] = stored.split(DELIMITER);
  if (!salt || !derived) {
    return false;
  }

  try {
    const hashed = scryptSync(password, salt, 64).toString("hex");
    return timingSafeEqual(Buffer.from(hashed, "hex"), Buffer.from(derived, "hex"));
  } catch {
    return false;
  }
}
