import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AgentsDashboard() {
  const { data: agents, refetch } = trpc.agents.list.useQuery();
  const updateStatus = trpc.agents.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "#22c55e";
      case "paused": return "#f59e0b";
      case "error": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>Agent Dashboard</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Monitor and control your AI agents</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {agents?.map((agent) => (
          <Card key={agent.id}>
            <CardContent style={{ padding: "20px" }}>
              
              {/* Agent Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "#06b6d420", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px"
                  }}>🤖</div>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>{agent.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{agent.currentTask || agent.type}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getStatusColor(agent.status) }}></div>
                  <span style={{
                    fontSize: "12px", padding: "3px 10px", borderRadius: "999px",
                    color: getStatusColor(agent.status),
                    background: getStatusColor(agent.status) + "20",
                    border: `1px solid ${getStatusColor(agent.status)}30`
                  }}>{agent.status}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Success Rate", value: `${agent.successRate}%`, color: "#22c55e" },
                  { label: "Avg Response", value: `${agent.avgResponseTime}ms`, color: "#06b6d4" },
                  { label: "Tasks Done", value: agent.tasksCompleted, color: "#8b5cf6" },
                  { label: "CPU Usage", value: `${agent.cpuUsage}%`, color: "#f59e0b" },
                  { label: "Memory", value: `${agent.memoryUsage}%`, color: "#f97316" },
                  { label: "Type", value: agent.type.replace("_", " "), color: "#6b7280" },
                ].map((stat) => (
                  <div key={stat.label} style={{ padding: "10px", borderRadius: "8px", background: "#0d1626" }}>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: "0 0 4px 0" }}>{stat.label}</p>
                    <p style={{ fontWeight: "bold", fontSize: "13px", color: stat.color, margin: 0 }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => updateStatus.mutate({ id: agent.id, status: "active" })}
                  disabled={agent.status === "active"}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #22c55e30",
                    background: "#22c55e20", color: "#22c55e", cursor: "pointer",
                    fontSize: "13px", fontWeight: "500",
                    opacity: agent.status === "active" ? 0.5 : 1
                  }}>
                  ▶ Activate
                </button>
                <button
                  onClick={() => updateStatus.mutate({ id: agent.id, status: "paused" })}
                  disabled={agent.status === "paused"}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px", border: "1px solid #f59e0b30",
                    background: "#f59e0b20", color: "#f59e0b", cursor: "pointer",
                    fontSize: "13px", fontWeight: "500",
                    opacity: agent.status === "paused" ? 0.5 : 1
                  }}>
                  ⏸ Pause
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}