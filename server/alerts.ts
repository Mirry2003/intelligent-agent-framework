import nodemailer from "nodemailer";
import { getAllAgents, getAllLegacySystems } from "./db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
});

export async function sendAlertEmail(
  to: string,
  subject: string,
  message: string
) {
  try {
    await transporter.sendMail({
      from: process.env.ALERT_EMAIL,
      to,
      subject: `🚨 IAF Alert: ${subject}`,
      html: `
        <div style="font-family: sans-serif; background: #0a0f1e; color: white; padding: 24px; border-radius: 12px;">
          <h2 style="color: #06b6d4;">⚡ IAF Dashboard Alert</h2>
          <p style="color: #9ca3af;">${message}</p>
          <hr style="border-color: #1e3a5f;" />
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated alert from your Intelligent Agent Framework
          </p>
        </div>
      `,
    });
    console.log(`✅ Alert email sent: ${subject}`);
  } catch (error) {
    console.error("Failed to send alert email:", error);
  }
}

export async function checkAndSendAlerts(alertEmail: string) {
  const agents = await getAllAgents();
  const systems = await getAllLegacySystems();

  for (const agent of agents) {
    if (agent.cpuUsage > 80) {
      await sendAlertEmail(
        alertEmail,
        `High CPU Usage - ${agent.name}`,
        `Agent <strong>${agent.name}</strong> is using <strong>${agent.cpuUsage}%</strong> CPU. This exceeds the 80% threshold.`
      );
    }
    if (agent.memoryUsage > 85) {
      await sendAlertEmail(
        alertEmail,
        `High Memory Usage - ${agent.name}`,
        `Agent <strong>${agent.name}</strong> is using <strong>${agent.memoryUsage}%</strong> memory. This exceeds the 85% threshold.`
      );
    }
    if (agent.status === "error") {
      await sendAlertEmail(
        alertEmail,
        `Agent Error - ${agent.name}`,
        `Agent <strong>${agent.name}</strong> has encountered an error and needs attention.`
      );
    }
    if (agent.successRate < 80) {
      await sendAlertEmail(
        alertEmail,
        `Low Success Rate - ${agent.name}`,
        `Agent <strong>${agent.name}</strong> success rate has dropped to <strong>${agent.successRate}%</strong>.`
      );
    }
  }

  const disconnectedSystems = systems.filter(s => s.status === "disconnected");
  if (disconnectedSystems.length > 0) {
    await sendAlertEmail(
      alertEmail,
      "Systems Disconnected",
      `The following systems are disconnected: <strong>${disconnectedSystems.map(s => s.name).join(", ")}</strong>`
    );
  }
}
