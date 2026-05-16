import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import {
  getAllAgents,
  getAgentById,
  updateAgent,
  getAllMlModels,
  getMlModelById,
  createMlModel,
  updateMlModel,
  getAllLegacySystems,
  getLegacySystemById,
  createLegacySystem,
  updateLegacySystem,
  getActivityFeed,
  createActivityFeedItem,
  getIntegrationLogs,
  getAllSystemConfig,
  upsertSystemConfig,
} from "./db";
import { runSimulationTick, seedInitialData } from "./agentEngine";

// ═══════════════════════════════════════════════════════════════
// AGENTS ROUTER
// ═══════════════════════════════════════════════════════════════

const agentsRouter = router({
  // Get all agents
  list: publicProcedure.query(async () => {
    await seedInitialData(); // Ensure data exists
    return await getAllAgents();
  }),

  // Get single agent by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getAgentById(input.id)),

  // Update agent status (active/paused/error)
  updateStatus: publicProcedure
    .input(z.object({ id: z.number(), status: z.enum(["active", "paused", "error"]) }))
    .mutation(async ({ input }) => {
      await updateAgent(input.id, { status: input.status });
      return { success: true };
    }),

  // Update agent configuration
  updateConfig: publicProcedure
    .input(z.object({ id: z.number(), config: z.record(z.any()) }))
    .mutation(async ({ input }) => {
      await updateAgent(input.id, { config: JSON.stringify(input.config) });
      return { success: true };
    }),

  // Run one simulation tick (agents do work)
  tick: publicProcedure.mutation(async () => {
    await runSimulationTick();
    return { success: true };
  }),
});

// ═══════════════════════════════════════════════════════════════
// ML MODELS ROUTER
// ═══════════════════════════════════════════════════════════════

const mlModelsRouter = router({
  // Get all models
  list: publicProcedure.query(() => getAllMlModels()),

  // Get single model
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getMlModelById(input.id)),

  // Create new model
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["classification", "regression", "clustering", "anomaly_detection"]),
        algorithm: z.string().optional(),
        description: z.string().optional(),
        trainingDataSize: z.number(),
        epochs: z.number(),
        learningRate: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createMlModel({
        ...input,
        status: "untrained",
        learningRate: input.learningRate.toString(),
        trainingProgress: 0,
      });
      return { id };
    }),

  // Train model (simulate training progress)
  train: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const model = await getMlModelById(input.id);
      if (!model) throw new Error("Model not found");

      // Simulate training
      let progress = 0;
      while (progress < 100) {
        progress += Math.random() * 30;
        await updateMlModel(input.id, { trainingProgress: Math.min(100, progress) });
        await new Promise((r) => setTimeout(r, 100)); // Simulate training time
      }

      // After training, calculate metrics
      const accuracy = 80 + Math.random() * 20;
      const precision = accuracy - Math.random() * 5;
      const recall = accuracy - Math.random() * 5;
      const f1 = (2 * precision * recall) / (precision + recall);

      await updateMlModel(input.id, {
        status: "trained",
        accuracy: Math.round(accuracy),
        precision: Math.round(precision),
        recall: Math.round(recall),
        f1Score: Math.round(f1),
        trainingProgress: 100,
      });

      await createActivityFeedItem({
        category: "ml_prediction",
        severity: "success",
        title: `Model trained: ${model.name}`,
        description: `Training completed. Accuracy: ${Math.round(accuracy)}%`,
      });

      return { success: true };
    }),

  // Deploy model (make it available for predictions)
  deploy: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await updateMlModel(input.id, { status: "deployed" });
      const model = await getMlModelById(input.id);

      await createActivityFeedItem({
        category: "ml_prediction",
        severity: "success",
        title: `Model deployed: ${model?.name}`,
        description: `Model is now available for predictions`,
      });

      return { success: true };
    }),

  // Make a prediction using deployed model
  predict: publicProcedure
    .input(z.object({ id: z.number(), inputData: z.record(z.any()) }))
    .mutation(async ({ input }) => {
      const model = await getMlModelById(input.id);
      if (!model || model.status !== "deployed") {
        throw new Error("Model not deployed");
      }

      // Simulate prediction
      const confidence = 0.7 + Math.random() * 0.3; // 70-100%
      const prediction = confidence > 0.85 ? "POSITIVE" : "NEGATIVE";

      await createActivityFeedItem({
        category: "ml_prediction",
        severity: confidence > 0.85 ? "success" : "warning",
        title: `Prediction made: ${model.name}`,
        description: `Prediction: ${prediction} | Confidence: ${(confidence * 100).toFixed(1)}%`,
      });

      return {
        prediction,
        confidence: Math.round(confidence * 100),
        model: model.name,
      };
    }),
});

// ═══════════════════════════════════════════════════════════════
// LEGACY SYSTEMS ROUTER
// ═══════════════════════════════════════════════════════════════

const legacySystemsRouter = router({
  // Get all systems
  list: publicProcedure.query(() => getAllLegacySystems()),

  // Get single system
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getLegacySystemById(input.id)),

  // Create new system
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["erp", "crm", "database", "api", "file_system", "custom"]),
        endpoint: z.string().optional(),
        protocol: z.enum(["REST", "SOAP", "GraphQL", "JDBC", "FTP", "custom"]),
        dataFormat: z.enum(["JSON", "XML", "CSV", "Binary", "custom"]),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createLegacySystem({ ...input, status: "disconnected" });
      return { id };
    }),

  // Connect to system
  connect: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const system = await getLegacySystemById(input.id);
      await updateLegacySystem(input.id, {
        status: "connected",
        latency: Math.floor(Math.random() * 200) + 50,
        throughput: Math.floor(Math.random() * 2000) + 200,
        errorRate: Math.random() * 2,
        lastSync: new Date(),
      });

      await createActivityFeedItem({
        category: "integration",
        severity: "success",
        title: `System connected: ${system?.name}`,
        description: `Successfully connected to ${system?.name}`,
      });

      return { success: true };
    }),

  // Disconnect from system
  disconnect: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await updateLegacySystem(input.id, { status: "disconnected" });
      return { success: true };
    }),

  // Simulate operation (sync/transfer/validate)
  simulate: publicProcedure
    .input(z.object({ id: z.number(), action: z.enum(["sync", "transfer", "validate"]) }))
    .mutation(async ({ input }) => {
      const system = await getLegacySystemById(input.id);
      const success = Math.random() > 0.15; // 85% success rate
      const responseTime = Math.floor(Math.random() * 300) + 50;

      await createActivityFeedItem({
        category: "integration",
        severity: success ? "success" : "error",
        title: `${input.action} ${success ? "succeeded" : "failed"}: ${system?.name}`,
        description: success
          ? `Operation completed in ${responseTime}ms`
          : `Operation failed after ${responseTime}ms`,
      });

      return { success, responseTime };
    }),
});

// ═══════════════════════════════════════════════════════════════
// ACTIVITY FEED ROUTER
// ═══════════════════════════════════════════════════════════════

const activityRouter = router({
  // Get activity feed
  feed: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => getActivityFeed(input.limit ?? 50)),

  // Create activity entry
  create: publicProcedure
    .input(
      z.object({
        category: z.enum(["agent_action", "ml_prediction", "system_event", "integration", "alert", "decision"]),
        severity: z.enum(["info", "warning", "error", "success"]),
        title: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input }) => createActivityFeedItem(input)),
});

// ═══════════════════════════════════════════════════════════════
// INTEGRATION ROUTER
// ═══════════════════════════════════════════════════════════════

const integrationRouter = router({
  // Get integration logs
  logs: publicProcedure
    .input(z.object({ limit: z.number().optional() }))
    .query(({ input }) => getIntegrationLogs(input.limit ?? 50)),
});

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE ROUTER
// ═══════════════════════════════════════════════════════════════

const performanceRouter = router({
  // Get performance summary
  summary: publicProcedure.query(async () => {
    const agents = await getAllAgents();
    const models = await getAllMlModels();
    const systems = await getAllLegacySystems();

    const avgSuccessRate =
      agents.length > 0 ? agents.reduce((s, a) => s + a.successRate, 0) / agents.length : 0;
    const deployedModels = models.filter((m) => m.status === "deployed").length;
    const avgAccuracy =
      models.filter((m) => m.accuracy).length > 0
        ? models.filter((m) => m.accuracy).reduce((s, m) => s + (m.accuracy ?? 0), 0) /
          models.filter((m) => m.accuracy).length
        : 0;
    const connectedSystems = systems.filter((s) => s.status === "connected").length;

    return {
      totalTasks: agents.reduce((s, a) => s + a.tasksCompleted, 0),
      avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
      deployedModels,
      totalModels: models.length,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      connectedSystems,
      totalSystems: systems.length,
      activeAgents: agents.filter((a) => a.status === "active").length,
      totalAgents: agents.length,
    };
  }),
});

// ═══════════════════════════════════════════════════════════════
// CONFIG ROUTER
// ═══════════════════════════════════════════════════════════════

const configRouter = router({
  // Get all config
  list: publicProcedure.query(() => getAllSystemConfig()),

  // Update config
  update: publicProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
        category: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await upsertSystemConfig(input);
      return { success: true };
    }),
});

// ═══════════════════════════════════════════════════════════════
// COMBINE ALL ROUTERS
// ═══════════════════════════════════════════════════════════════

export const appRouter = router({
  agents: agentsRouter,
  mlModels: mlModelsRouter,
  legacySystems: legacySystemsRouter,
  activity: activityRouter,
  integration: integrationRouter,
  performance: performanceRouter,
  config: configRouter,
});

export type AppRouter = typeof appRouter;