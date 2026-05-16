import { int, varchar, text, timestamp, mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core";

// Table 1: Store information about each agent
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["data_collection", "decision_making", "monitoring", "communication"]).notNull(),
  status: mysqlEnum("status", ["active", "paused", "error"]).default("active"),
  description: text("description"),
  currentTask: varchar("currentTask", { length: 500 }),
  tasksCompleted: int("tasksCompleted").default(0),
  successRate: int("successRate").default(100), // 0-100
  avgResponseTime: int("avgResponseTime").default(0), // milliseconds
  cpuUsage: int("cpuUsage").default(0), // 0-100
  memoryUsage: int("memoryUsage").default(0), // 0-100
  config: text("config"), // JSON string
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Table 2: Store ML model information
export const mlModels = mysqlTable("ml_models", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["classification", "regression", "clustering", "anomaly_detection"]),
  algorithm: varchar("algorithm", { length: 255 }),
  description: text("description"),
  status: mysqlEnum("status", ["untrained", "trained", "deployed"]).default("untrained"),
  accuracy: int("accuracy"), // 0-100
  precision: int("precision"),
  recall: int("recall"),
  f1Score: int("f1Score"),
  trainingDataSize: int("trainingDataSize"),
  epochs: int("epochs"),
  learningRate: varchar("learningRate", { length: 50 }),
  trainingProgress: int("trainingProgress").default(0), // 0-100
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Table 3: Store legacy systems (old systems you're integrating with)
export const legacySystems = mysqlTable("legacy_systems", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["erp", "crm", "database", "api", "file_system", "custom"]),
  endpoint: varchar("endpoint", { length: 500 }),
  protocol: mysqlEnum("protocol", ["REST", "SOAP", "GraphQL", "JDBC", "FTP", "custom"]),
  dataFormat: mysqlEnum("dataFormat", ["JSON", "XML", "CSV", "Binary", "custom"]),
  status: mysqlEnum("status", ["connected", "disconnected", "error"]).default("disconnected"),
  latency: int("latency"), // milliseconds
  throughput: int("throughput"), // records per second
  errorRate: int("errorRate"), // percentage
  lastSync: timestamp("lastSync"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Table 4: Store activity feed (all events that happen)
export const activityFeed = mysqlTable("activity_feed", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId"),
  agentName: varchar("agentName", { length: 255 }),
  category: mysqlEnum("category", ["agent_action", "ml_prediction", "system_event", "integration", "alert", "decision"]),
  severity: mysqlEnum("severity", ["info", "warning", "error", "success"]),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Table 5: Store integration logs (records of system-to-system communication)
export const integrationLogs = mysqlTable("integration_logs", {
  id: int("id").autoincrement().primaryKey(),
  legacySystemId: int("legacySystemId"),
  agentId: int("agentId"),
  type: mysqlEnum("type", ["data_transfer", "sync", "api_call"]),
  status: mysqlEnum("status", ["success", "failure", "pending"]),
  message: text("message"),
  responseTime: int("responseTime"), // milliseconds
  createdAt: timestamp("createdAt").defaultNow(),
});

// Table 6: Store performance metrics (snapshots of system performance)
export const performanceMetrics = mysqlTable("performanceMetrics", {
  id: int("id").autoincrement().primaryKey(),
  agentId: int("agentId"),
  mlModelId: int("mlModelId"),
  metricType: varchar("metricType", { length: 100 }), // "success_rate", "response_time", etc
  value: int("value"),
  unit: varchar("unit", { length: 50 }), // "%", "ms", etc
  recordedAt: timestamp("recordedAt").defaultNow(),
});

// Table 7: Store system configuration
export const systemConfig = mysqlTable("systemConfig", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: varchar("value", { length: 1000 }),
  category: varchar("category", { length: 100 }), // "agent", "ml", "integration", etc
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

// Table 8: Store agent tasks
export const agentTasks = mysqlTable("agentTasks", {
  id: int("id").autoincrement().primaryKey(),
  fromAgentId: int("fromAgentId"),
  toAgentId: int("toAgentId").notNull(),
  title: varchar("title", { length: 500 }),
  description: text("description"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]),
  result: text("result"),
  scheduledAt: timestamp("scheduledAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Export types for TypeScript
export type Agent = typeof agents.$inferSelect;
export type MlModel = typeof mlModels.$inferSelect;
export type LegacySystem = typeof legacySystems.$inferSelect;
export type ActivityFeedItem = typeof activityFeed.$inferSelect;