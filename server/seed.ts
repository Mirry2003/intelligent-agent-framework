import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "../drizzle/schema";
import bcrypt from "bcryptjs";

export async function seedAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(schema.users.email, "admin@iaf.com"),
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin@2026", 10);
    await db.insert(schema.users).values({
      email: "admin@iaf.com",
      password: hashedPassword,
      name: "System Administrator",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("   Email: admin@iaf.com");
    console.log("   Password: Admin@2026");
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  }
}
