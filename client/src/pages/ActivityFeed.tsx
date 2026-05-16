import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ActivityFeed() {
  const { data: feed } = trpc.activity.feed.useQuery({ limit: 50 });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "success": return { color: "#22c55e", icon: "✓" };
      case "warning": return { color: "#f59e0b", icon: "⚠" };
      case "error": return { color: "#ef4444", icon: "✕" };
      default: return { color: "#06b6d4", icon: "ℹ" };
    }
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>Activity Feed</h1>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Real-time system events and agent activities</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>⚡ Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {feed?.map((item) => {
              const style = getSeverityStyle(item.severity);
              return (
                <div key={item.id} style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  padding: "12px", borderRadius: "8px", background: "#0d1626"
                }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: style.color + "20", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "bold", color: style.color,
                    flexShrink: 0, marginTop: "2px"
                  }}>{style.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: "500", color: style.color, margin: 0 }}>{item.title}</p>
                    <p style={{ color: "#6b7280", fontSize: "12px", margin: "3px 0 0 0" }}>{item.description}</p>
                    <p style={{ color: "#4b5563", fontSize: "11px", margin: "3px 0 0 0" }}>
                      {item.agentName && `${item.agentName} · `}{item.category}
                    </p>
                  </div>
                  <span style={{ color: "#4b5563", fontSize: "11px", whiteSpace: "nowrap" }}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}