import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Alerts() {
  const { data: agents } = trpc.agents.list.useQuery();
  const { data: systems } = trpc.legacySystems.list.useQuery();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const checkAlerts = async () => {
    if (!email) return setStatus("Please enter an email address");
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/alerts/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setStatus("✅ Alerts checked! Check your email for any notifications.");
      } else {
        setStatus("❌ " + data.error);
      }
    } catch (error) {
      setStatus("❌ Failed to send alerts");
    } finally {
      setLoading(false);
    }
  };

  const getAlertLevel = (agent: any) => {
    if (agent.status === "error") return { color: "#ef4444", label: "ERROR", icon: "🔴" };
    if (agent.cpuUsage > 80 || agent.memoryUsage > 85) return { color: "#f59e0b", label: "WARNING", icon: "🟡" };
    if (agent.successRate < 80) return { color: "#f59e0b", label: "WARNING", icon: "🟡" };
    return { color: "#22c55e", label: "HEALTHY", icon: "🟢" };
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>🚨 Alerts</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Monitor system health and receive email alerts</p>
      </div>

      {/* Email Alert Section */}
      <Card>
        <CardHeader>
          <CardTitle>📧 Email Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "12px" }}>
            Enter your email to receive alerts when agents have issues
          </p>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <input
              style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={checkAlerts} disabled={loading}
              style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#06b6d4", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "500", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Checking..." : "Check & Send Alerts"}
            </button>
          </div>
          {status && (
            <p style={{ color: status.includes("✅") ? "#22c55e" : "#ef4444", fontSize: "13px" }}>{status}</p>
          )}
        </CardContent>
      </Card>

      {/* Agent Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>🤖 Agent Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents?.map((agent) => {
              const alert = getAlertLevel(agent);
              return (
                <div key={agent.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", background: "#0d1626" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px" }}>{alert.icon}</span>
                    <div>
                      <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{agent.name}</p>
                      <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>CPU: {agent.cpuUsage}% | Memory: {agent.memoryUsage}% | Success: {agent.successRate}%</p>
                    </div>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "999px", color: alert.color, background: alert.color + "20" }}>
                    {alert.label}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 System Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {systems?.map((system) => (
              <div key={system.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: "8px", background: "#0d1626" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{system.status === "connected" ? "🟢" : "🔴"}</span>
                  <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{system.name}</p>
                </div>
                <span style={{
                  fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
                  color: system.status === "connected" ? "#22c55e" : "#ef4444",
                  background: system.status === "connected" ? "#22c55e20" : "#ef444420"
                }}>
                  {system.status}
                </span>
              </div>
            ))}
            {(!systems || systems.length === 0) && (
              <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center" }}>No systems added yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}