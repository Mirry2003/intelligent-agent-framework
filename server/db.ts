import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

// Create database connection
const pool = mysql.createPool(process.env.DATABASE_URL || "");
export const db = drizzle(pool, { schema, mode: "default" });

// ═══════════════════════════════════════════════════════════════
// AGENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getAllAgents() {
  return await db.query.agents.findMany();
}

export async function getAgentById(id: number) {
  return await db.query.agents.findFirst({
    where: (agents, { eq }) => eq(agents.id, id),
  });
}

export async function updateAgent(id: number, data: Partial<schema.Agent>) {
  await db.update(schema.agents).set(data).where(eq(schema.agents.id, id));
}

export async function createAgent(data: Omit<schema.Agent, "id" | "createdAt" | "updatedAt">) {
  const result = await db.insert(schema.agents).values(data);
  return result[0].insertId;
}

// ═══════════════════════════════════════════════════════════════
// ML MODEL FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getAllMlModels() {
  return await db.query.mlModels.findMany();
}

export async function getMlModelById(id: number) {
  return await db.query.mlModels.findFirst({
    where: (models, { eq }) => eq(models.id, id),
  });
}

export async function createMlModel(data: Omit<schema.MlModel, "id" | "createdAt" | "updatedAt">) {
  const result = await db.insert(schema.mlModels).values(data);
  return result[0].insertId;
}

export async function updateMlModel(id: number, data: Partial<schema.MlModel>) {
  await db.update(schema.mlModels).set(data).where(eq(schema.mlModels.id, id));
}

// ═══════════════════════════════════════════════════════════════
// LEGACY SYSTEMS FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getAllLegacySystems() {
  return await db.query.legacySystems.findMany();
}

export async function getLegacySystemById(id: number) {
  return await db.query.legacySystems.findFirst({
    where: (systems, { eq }) => eq(systems.id, id),
  });
}

export async function createLegacySystem(data: Omit<schema.LegacySystem, "id" | "createdAt" | "updatedAt">) {
  const result = await db.insert(schema.legacySystems).values(data);
  return result[0].insertId;
}

export async function updateLegacySystem(id: number, data: Partial<schema.LegacySystem>) {
  await db.update(schema.legacySystems).set(data).where(eq(schema.legacySystems.id, id));
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY FEED FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getActivityFeed(limit: number = 50) {
  return await db.query.activityFeed.findMany({
    limit,
    orderBy: (feed, { desc }) => [desc(feed.createdAt)],
  });
}

export async function createActivityFeedItem(data: Omit<schema.ActivityFeedItem, "id" | "createdAt">) {
  await db.insert(schema.activityFeed).values(data);
}

// ═══════════════════════════════════════════════════════════════
// INTEGRATION LOG FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getIntegrationLogs(limit: number = 50) {
  return await db.query.integrationLogs.findMany({
    limit,
    orderBy: (logs, { desc }) => [desc(logs.createdAt)],
  });
}

export async function createIntegrationLog(data: Omit<schema.IntegrationLog, "id" | "createdAt">) {
  await db.insert(schema.integrationLogs).values(data);
}

// ═══════════════════════════════════════════════════════════════
// CONFIG FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getAllSystemConfig() {
  return await db.query.systemConfig.findMany();
}

export async function upsertSystemConfig(data: Omit<schema.SystemConfig, "id" | "createdAt" | "updatedAt">) {
  await db.insert(schema.systemConfig).values(data).onDuplicateKeyUpdate({
    set: { value: data.value, description: data.description },
  });
}