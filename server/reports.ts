import PDFDocument from "pdfkit";
import { Response } from "express";
import { getAllAgents, getAllMlModels, getAllLegacySystems } from "./db";

export async function generatePerformanceReport(res: Response) {
  const agents = await getAllAgents();
  const models = await getAllMlModels();
  const systems = await getAllLegacySystems();

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=IAF-Performance-Report.pdf");

  doc.pipe(res);

  // Header
  doc.rect(0, 0, 612, 80).fill("#0a0f1e");
  doc.fillColor("#06b6d4").fontSize(24).text("⚡ IAF Performance Report", 50, 25);
  doc.fillColor("#9ca3af").fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, 50, 55);

  doc.moveDown(2);

  // Summary Section
  doc.fillColor("#ffffff").fontSize(16).text("System Summary", 50, 100);
  doc.moveTo(50, 120).lineTo(562, 120).strokeColor("#1e3a5f").stroke();

  const activeAgents = agents.filter(a => a.status === "active").length;
  const avgSuccessRate = agents.length > 0
    ? (agents.reduce((s, a) => s + a.successRate, 0) / agents.length).toFixed(1)
    : 0;
  const deployedModels = models.filter(m => m.status === "deployed").length;
  const connectedSystems = systems.filter(s => s.status === "connected").length;
  const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);

  doc.fillColor("#9ca3af").fontSize(11);
  doc.text(`Total Tasks Completed: ${totalTasks.toLocaleString()}`, 50, 130);
  doc.text(`Active Agents: ${activeAgents}/${agents.length}`, 50, 148);
  doc.text(`Average Success Rate: ${avgSuccessRate}%`, 50, 166);
  doc.text(`Deployed ML Models: ${deployedModels}/${models.length}`, 50, 184);
  doc.text(`Connected Systems: ${connectedSystems}/${systems.length}`, 50, 202);

  // Agents Section
  doc.moveDown(2);
  doc.fillColor("#ffffff").fontSize(16).text("Agent Performance", 50, 230);
  doc.moveTo(50, 250).lineTo(562, 250).strokeColor("#1e3a5f").stroke();

  let yPos = 260;
  agents.forEach((agent) => {
    if (yPos > 700) { doc.addPage(); yPos = 50; }

    doc.fillColor("#06b6d4").fontSize(12).text(agent.name, 50, yPos);
    doc.fillColor("#9ca3af").fontSize(10);
    doc.text(`Status: ${agent.status}`, 50, yPos + 16);
    doc.text(`Success Rate: ${agent.successRate}%`, 200, yPos + 16);
    doc.text(`Tasks Completed: ${agent.tasksCompleted}`, 350, yPos + 16);
    doc.text(`CPU: ${agent.cpuUsage}% | Memory: ${agent.memoryUsage}%`, 50, yPos + 32);
    doc.text(`Avg Response Time: ${agent.avgResponseTime}ms`, 350, yPos + 32);
    doc.moveTo(50, yPos + 48).lineTo(562, yPos + 48).strokeColor("#1e3a5f").stroke();
    yPos += 58;
  });

  // ML Models Section
  doc.addPage();
  doc.fillColor("#ffffff").fontSize(16).text("ML Models", 50, 50);
  doc.moveTo(50, 70).lineTo(562, 70).strokeColor("#1e3a5f").stroke();

  yPos = 80;
  models.forEach((model) => {
    if (yPos > 700) { doc.addPage(); yPos = 50; }

    doc.fillColor("#8b5cf6").fontSize(12).text(model.name, 50, yPos);
    doc.fillColor("#9ca3af").fontSize(10);
    doc.text(`Type: ${model.type}`, 50, yPos + 16);
    doc.text(`Status: ${model.status}`, 200, yPos + 16);
    if (model.accuracy) {
      doc.text(`Accuracy: ${model.accuracy}%`, 350, yPos + 16);
      doc.text(`Precision: ${model.precision}% | Recall: ${model.recall}% | F1: ${model.f1Score}%`, 50, yPos + 32);
    }
    doc.moveTo(50, yPos + 48).lineTo(562, yPos + 48).strokeColor("#1e3a5f").stroke();
    yPos += 58;
  });

  // Legacy Systems Section
  doc.addPage();
  doc.fillColor("#ffffff").fontSize(16).text("Legacy Systems", 50, 50);
  doc.moveTo(50, 70).lineTo(562, 70).strokeColor("#1e3a5f").stroke();

  yPos = 80;
  systems.forEach((system) => {
    if (yPos > 700) { doc.addPage(); yPos = 50; }

    doc.fillColor("#f59e0b").fontSize(12).text(system.name, 50, yPos);
    doc.fillColor("#9ca3af").fontSize(10);
    doc.text(`Type: ${system.type}`, 50, yPos + 16);
    doc.text(`Protocol: ${system.protocol}`, 200, yPos + 16);
    doc.text(`Status: ${system.status}`, 350, yPos + 16);
    doc.text(`Latency: ${system.latency ?? 0}ms | Error Rate: ${system.errorRate?.toFixed(1) ?? 0}%`, 50, yPos + 32);
    doc.moveTo(50, yPos + 48).lineTo(562, yPos + 48).strokeColor("#1e3a5f").stroke();
    yPos += 58;
  });

  // Footer
  doc.fillColor("#6b7280").fontSize(9).text(
    "Intelligent Agent Framework — Confidential Report",
    50, 750, { align: "center" }
  );

  doc.end();
}
