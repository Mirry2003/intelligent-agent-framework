import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";

const JWT_SECRET = process.env.JWT_SECRET || "iaf-secret-key-2026";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

export async function registerUser(email: string, password: string, name: string) {
  const existing = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await hashPassword(password);
  const result = await db.insert(schema.users).values({
    email,
    password: hashedPassword,
    name,
    role: "user",
  });
  return result[0].insertId;
}

export async function loginUser(email: string, password: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.email, email),
  });
  if (!user) throw new Error("Invalid email or password");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  const token = generateToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}
