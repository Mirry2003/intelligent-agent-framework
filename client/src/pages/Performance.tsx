import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Performance() {
  const { data: summary } = trpc.performance.summary.useQuery();
  const { data: agents } = trpc.agents.list.useQuery();

  const agentChartData = agents?.map((agent) => ({
    name: agent.name.split("-")[0],
    cpu: agent.cpuUsage,
    memory: agent.memoryUsage,
    success: agent.successRate,
  }));

  const tooltipStyle = {
    backgroundColor: "#111827",
    border: "1px solid #1e3a5f",
    borderRadius: "8px",
    color: "#fff",
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>Performance</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>System performance metrics and analytics</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "16px" }}>
        {[
          { label: "Total Tasks", value: summary?.totalTasks?.toLocaleString() ?? 0, color: "#06b6d4" },
          { label: "Avg Success Rate", value: `${summary?.avgSuccessRate ?? 0}%`, color: "#22c55e" },
          { label: "ML Accuracy", value: `${summary?.avgAccuracy ?? 0}%`, color: "#8b5cf6" },
          { label: "Active Agents", value: `${summary?.activeAgents ?? 0}/${summary?.totalAgents ?? 0}`, color: "#f59e0b" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent style={{ padding: "20px" }}>
              <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px 0" }}>{stat.label}</p>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: stat.color, margin: 0 }}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resource Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Resource Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cpu" fill="#06b6d4" name="CPU %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="memory" fill="#8b5cf6" name="Memory %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success Rate Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Success Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={agentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="success" fill="#22c55e" name="Success Rate %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents?.map((agent) => (
              <div key={agent.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px", borderRadius: "8px", background: "#0d1626"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>🤖</span>
                  <div>
                    <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{agent.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{agent.type}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#22c55e", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{agent.successRate}%</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>Success</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{agent.cpuUsage}%</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>CPU</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#8b5cf6", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{agent.memoryUsage}%</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>Memory</p>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ color: "#06b6d4", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{agent.tasksCompleted}</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>Tasks</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Report Button */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <a href="/api/reports/performance" download="IAF-Report.pdf"
          style={{
            padding: "10px 20px", borderRadius: "8px",
            background: "#8b5cf6", color: "white",
            textDecoration: "none", fontSize: "13px",
            fontWeight: "500", display: "inline-block"
          }}>
          📄 Download PDF Report
        </a>
      </div>
    </div>
  );
}