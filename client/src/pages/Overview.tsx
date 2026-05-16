import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Overview() {
  const { data: agents, refetch: refetchAgents } = trpc.agents.list.useQuery();
  const { data: summary } = trpc.performance.summary.useQuery();
  const { data: feed } = trpc.activity.feed.useQuery({ limit: 5 });

  const tickMutation = trpc.agents.tick.useMutation({
    onSuccess: () => refetchAgents(),
  });

  useEffect(() => {
    const interval = setInterval(() => tickMutation.mutate(), 4000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success": return "#22c55e";
      case "warning": return "#f59e0b";
      case "error": return "#ef4444";
      default: return "#06b6d4";
    }
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>System Overview</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
            Intelligent Agent Framework — Real-time monitoring and control
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%" }}></div>
          <span style={{ color: "#22c55e", fontSize: "13px" }}>Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        
        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>🤖</span>
              <span style={{ fontSize: "11px", color: "#22c55e", background: "#22c55e15", padding: "3px 8px", borderRadius: "999px" }}>
                {summary?.activeAgents}/{summary?.totalAgents} active
              </span>
            </div>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white", margin: 0 }}>
              {summary?.totalTasks?.toLocaleString() ?? 0}
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Total Tasks Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>📈</span>
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Avg</span>
            </div>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white", margin: 0 }}>
              {summary?.avgSuccessRate ?? 0}%
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Agent Success Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>🧠</span>
              <span style={{ fontSize: "11px", color: "#06b6d4", background: "#06b6d415", padding: "3px 8px", borderRadius: "999px" }}>
                {summary?.deployedModels ?? 0} deployed
              </span>
            </div>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white", margin: 0 }}>
              {summary?.avgAccuracy ?? 0}%
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>ML Model Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>🔗</span>
              <span style={{ fontSize: "11px", color: "#f59e0b", background: "#f59e0b15", padding: "3px 8px", borderRadius: "999px" }}>
                {summary?.connectedSystems}/{summary?.totalSystems} online
              </span>
            </div>
            <p style={{ fontSize: "32px", fontWeight: "bold", color: "white", margin: 0 }}>
              {summary?.totalSystems ? Math.round((summary.connectedSystems / summary.totalSystems) * 100) : 0}%
            </p>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Integration Success Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Status */}
      <Card>
        <CardHeader>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <CardTitle>🤖 Agent Status</CardTitle>
            <button onClick={() => tickMutation.mutate()}
              disabled={tickMutation.isPending}
              style={{ background: "transparent", border: "none", color: "#06b6d4", cursor: "pointer", fontSize: "13px" }}>
              {tickMutation.isPending ? "Running..." : "View all →"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {agents?.map((agent) => (
              <div key={agent.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px", borderRadius: "8px", background: "#0d1626"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: "#06b6d420", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "14px"
                  }}>🤖</div>
                  <div>
                    <p style={{ color: "white", fontSize: "13px", fontWeight: "600", margin: 0 }}>{agent.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{agent.currentTask || agent.type}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#22c55e", fontWeight: "bold", fontSize: "13px", margin: 0 }}>{agent.successRate}%</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{agent.avgResponseTime}ms avg resp</p>
                  </div>
                  <div style={{ width: "8px", height: "8px", background: "#22c55e", borderRadius: "50%" }}></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <CardTitle>⚡ Recent Activity</CardTitle>
            <a href="/activity" style={{ color: "#06b6d4", fontSize: "13px", textDecoration: "none" }}>View all →</a>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {feed?.map((item) => (
              <div key={item.id} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                padding: "10px", borderRadius: "8px", background: "#0d1626"
              }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: getSeverityColor(item.severity) + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "2px"
                }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getSeverityColor(item.severity) }}></div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: getSeverityColor(item.severity), margin: 0 }}>{item.title}</p>
                  <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "2px", margin: 0 }}>{item.description}</p>
                </div>
                <span style={{ color: "#4b5563", fontSize: "11px", whiteSpace: "nowrap" }}>
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            {[
              { href: "/models", label: "ML Models", icon: "🧠", color: "#06b6d4" },
              { href: "/systems", label: "Legacy Systems", icon: "🔗", color: "#f59e0b" },
              { href: "/activity", label: "Activity Feed", icon: "📋", color: "#8b5cf6" },
              { href: "/performance", label: "Performance", icon: "📈", color: "#22c55e" },
            ].map((item) => (
              <a key={item.href} href={item.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                padding: "16px", borderRadius: "12px", textDecoration: "none",
                background: item.color + "15", border: `1px solid ${item.color}30`,
                transition: "opacity 0.2s"
              }}>
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <span style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center" }}>{item.label}</span>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}