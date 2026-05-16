import {
  getAllAgents,
  updateAgent,
  getAllMlModels,
  getAllLegacySystems,
  createActivityFeedItem,
  createIntegrationLog,
  createAgent,
} from "./db";

// ═══════════════════════════════════════════════════════════════
// AGENT SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * This function runs every 4 seconds and simulates agent activity.
 * Think of it like a heartbeat - every beat, agents do work.
 */
export async function runSimulationTick() {
  try {
    // Get all agents from database
    const agents = await getAllAgents();
    const systems = await getAllLegacySystems();
    const models = await getAllMlModels();

    // For each agent, simulate what it does
    for (const agent of agents) {
      if (agent.status === "paused") continue; // Skip paused agents

      // Simulate agent work based on its type
      if (agent.type === "data_collection") {
        await simulateDataCollector(agent, systems);
      } else if (agent.type === "decision_making") {
        await simulateDecisionMaker(agent, models);
      } else if (agent.type === "monitoring") {
        await simulateMonitor(agent, agents, systems);
      } else if (agent.type === "communication") {
        await simulateCommunicator(agent);
      }

      // Update agent metrics (simulate CPU/memory usage)
      const newCpuUsage = Math.max(10, Math.random() * 80);
      const newMemoryUsage = Math.max(20, Math.random() * 85);
      const newSuccessRate = Math.max(85, 99 - Math.random() * 10);

      await updateAgent(agent.id, {
        cpuUsage: Math.round(newCpuUsage),
        memoryUsage: Math.round(newMemoryUsage),
        successRate: Math.round(newSuccessRate * 10) / 10,
        tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 5),
      });
    }
  } catch (error) {
    console.error("Simulation tick error:", error);
  }
}

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL AGENT SIMULATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * DATA COLLECTOR AGENT
 * Simulates gathering data from legacy systems
 */
async function simulateDataCollector(agent: any, systems: any[]) {
  // Pick a random legacy system
  const randomSystem = systems[Math.floor(Math.random() * systems.length)];

  if (!randomSystem || randomSystem.status !== "connected") {
    await createActivityFeedItem({
      agentId: agent.id,
      agentName: agent.name,
      category: "agent_action",
      severity: "warning",
      title: `${agent.name}: Data collection skipped`,
      description: `No connected systems available for data collection`,
    });
    return;
  }

  // Simulate data transfer
  const recordsProcessed = Math.floor(Math.random() * 5000) + 1000;
  const responseTime = Math.floor(Math.random() * 300) + 50;

  await createIntegrationLog({
    legacySystemId: randomSystem.id,
    agentId: agent.id,
    type: "data_transfer",
    status: "success",
    message: `Collected ${recordsProcessed} records from ${randomSystem.name}`,
    responseTime,
  });

  await createActivityFeedItem({
    agentId: agent.id,
    agentName: agent.name,
    category: "agent_action",
    severity: "success",
    title: `${agent.name}: Data collection completed`,
    description: `Successfully collected ${recordsProcessed} records in ${responseTime}ms`,
  });
}

/**
 * DECISION MAKER AGENT
 * Simulates analyzing data and making decisions
 */
async function simulateDecisionMaker(agent: any, models: any[]) {
  // Pick a deployed model
  const deployedModels = models.filter((m) => m.status === "deployed");

  if (deployedModels.length === 0) {
    await createActivityFeedItem({
      agentId: agent.id,
      agentName: agent.name,
      category: "decision",
      severity: "info",
      title: `${agent.name}: No models available`,
      description: `No deployed ML models for decision making`,
    });
    return;
  }

  const model = deployedModels[Math.floor(Math.random() * deployedModels.length)];
  const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
  const decision = confidence > 0.85 ? "APPROVE" : "REVIEW";

  await createActivityFeedItem({
    agentId: agent.id,
    agentName: agent.name,
    category: "decision",
    severity: confidence > 0.85 ? "success" : "warning",
    title: `${agent.name}: Decision made using ${model.name}`,
    description: `Decision: ${decision} | Confidence: ${(confidence * 100).toFixed(1)}%`,
  });
}

/**
 * MONITORING AGENT
 * Simulates checking system health
 */
async function simulateMonitor(agent: any, allAgents: any[], systems: any[]) {
  // Check agent health
  const unhealthyAgents = allAgents.filter((a) => a.cpuUsage > 80 || a.memoryUsage > 85);

  if (unhealthyAgents.length > 0) {
    await createActivityFeedItem({
      agentId: agent.id,
      agentName: agent.name,
      category: "alert",
      severity: "warning",
      title: `${agent.name}: High resource usage detected`,
      description: `${unhealthyAgents.length} agent(s) exceeding resource thresholds`,
    });
  }

  // Check system connectivity
  const disconnectedSystems = systems.filter((s) => s.status !== "connected");

  if (disconnectedSystems.length > 0) {
    await createActivityFeedItem({
      agentId: agent.id,
      agentName: agent.name,
      category: "alert",
      severity: "error",
      title: `${agent.name}: System connectivity issues`,
      description: `${disconnectedSystems.length} system(s) not connected`,
    });
  }

  // If everything is healthy
  if (unhealthyAgents.length === 0 && disconnectedSystems.length === 0) {
    await createActivityFeedItem({
      agentId: agent.id,
      agentName: agent.name,
      category: "system_event",
      severity: "success",
      title: `${agent.name}: All systems healthy`,
      description: `System health check passed. All agents and systems operational.`,
    });
  }
}

/**
 * COMMUNICATION AGENT
 * Simulates sending notifications and messages
 */
async function simulateCommunicator(agent: any) {
  const messageTypes = [
    "Agent status update sent",
    "Alert notification dispatched",
    "Performance report generated",
    "Integration status message routed",
  ];

  const randomMessage = messageTypes[Math.floor(Math.random() * messageTypes.length)];

  await createActivityFeedItem({
    agentId: agent.id,
    agentName: agent.name,
    category: "integration",
    severity: "info",
    title: `${agent.name}: ${randomMessage}`,
    description: `Message routed to downstream systems successfully`,
  });
}

/**
 * Initialize system with seed data (run once at startup)
 */
export async function seedInitialData() {
  const existingAgents = await getAllAgents();
  if (existingAgents.length > 0) return; // Already seeded

  // Create 4 agents
  const agentTypes = [
    {
      name: "DataCollector-Alpha",
      type: "data_collection",
      description: "Collects data from legacy systems",
    },
    {
      name: "DecisionEngine-Beta",
      type: "decision_making",
      description: "Makes autonomous decisions based on data",
    },
    {
      name: "SystemMonitor-Gamma",
      type: "monitoring",
      description: "Monitors system health and alerts",
    },
    {
      name: "CommAgent-Delta",
      type: "communication",
      description: "Manages inter-system communication",
    },
  ];

  for (const agentData of agentTypes) {
    await createAgent({
      ...agentData,
      status: "active",
      tasksCompleted: Math.floor(Math.random() * 1000),
      successRate: 85 + Math.random() * 15,
      avgResponseTime: 100 + Math.random() * 200,
      cpuUsage: Math.random() * 60,
      memoryUsage: Math.random() * 70,
      config: JSON.stringify({ maxTasksPerMinute: 10, timeout: 5000 }),
    });
  }

  console.log("✓ Initial data seeded");
}