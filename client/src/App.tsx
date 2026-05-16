import { Route, Switch } from "wouter";
import Overview from "./pages/Overview";
import AgentsDashboard from "./pages/AgentsDashboard";
import MLModels from "./pages/MLModels";
import LegacySystems from "./pages/LegacySystems";
import ActivityFeed from "./pages/ActivityFeed";
import Performance from "./pages/Performance";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1e", overflow: "hidden" }}>
      
      {/* Sidebar - Fixed width */}
      <div style={{
        width: "220px",
        minWidth: "220px",
        height: "100vh",
        background: "#070d1a",
        borderRight: "1px solid #1e3a5f",
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ marginBottom: "24px", padding: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#06b6d4", fontSize: "18px" }}>⚡</span>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>IAF Dashboard</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px", marginLeft: "26px" }}>
            Intelligent Agent Framework
          </p>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {[
            { href: "/", label: "Overview", icon: "▦" },
            { href: "/agents", label: "Agent Dashboard", icon: "◎", badge: "4" },
            { href: "/models", label: "ML Models", icon: "⊕" },
            { href: "/systems", label: "Legacy Systems", icon: "⊟" },
            { href: "/activity", label: "Activity Feed", icon: "∿" },
            { href: "/performance", label: "Performance", icon: "◷" },
          ].map((item) => (
            <a key={item.href} href={item.href} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#9ca3af",
              fontSize: "13px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e3a5f40";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "#06b6d4" }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  background: "#06b6d420",
                  color: "#06b6d4",
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "999px"
                }}>{item.badge}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Bottom Status */}
        <div style={{
          borderTop: "1px solid #1e3a5f",
          paddingTop: "12px",
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <div style={{
            width: "8px", height: "8px",
            background: "#22c55e",
            borderRadius: "50%"
          }}></div>
          <span style={{ color: "#6b7280", fontSize: "12px" }}>System Online</span>
        </div>
      </div>

      {/* Main Content - Takes remaining space */}
      <div style={{
        flex: 1,
        height: "100vh",
        overflowY: "auto",
        background: "#0a0f1e"
      }}>
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/agents" component={AgentsDashboard} />
          <Route path="/models" component={MLModels} />
          <Route path="/systems" component={LegacySystems} />
          <Route path="/activity" component={ActivityFeed} />
          <Route path="/performance" component={Performance} />
        </Switch>
      </div>
    </div>
  );
}

export default App;