import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import Overview from "./pages/Overview";
import AgentsDashboard from "./pages/AgentsDashboard";
import MLModels from "./pages/MLModels";
import LegacySystems from "./pages/LegacySystems";
import ActivityFeed from "./pages/ActivityFeed";
import Performance from "./pages/Performance";
import Login from "./pages/Login";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any, token: string) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    fetch("/api/logout", { method: "POST", credentials: "include" });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0f1e" }}>
        <p style={{ color: "white" }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1e", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: "220px", minWidth: "220px", height: "100vh",
        background: "#070d1a", borderRight: "1px solid #1e3a5f",
        display: "flex", flexDirection: "column", padding: "16px", overflowY: "auto"
      }}>
        <div style={{ marginBottom: "24px", padding: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#06b6d4", fontSize: "18px" }}>⚡</span>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "16px" }}>IAF Dashboard</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "11px", marginTop: "4px", marginLeft: "26px" }}>
            Intelligent Agent Framework
          </p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <span style={{ color: "#06b6d4" }}>▦</span> Overview
          </a>
          <a href="/agents" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: "#06b6d4" }}>◎</span> Agent Dashboard
            </div>
            <span style={{ background: "#06b6d420", color: "#06b6d4", fontSize: "11px", padding: "2px 8px", borderRadius: "999px" }}>4</span>
          </a>
          <a href="/models" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <span style={{ color: "#06b6d4" }}>⊕</span> ML Models
          </a>
          <a href="/systems" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <span style={{ color: "#06b6d4" }}>⊟</span> Legacy Systems
          </a>
          <a href="/activity" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <span style={{ color: "#06b6d4" }}>∿</span> Activity Feed
          </a>
          <a href="/performance" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "8px", textDecoration: "none", color: "#9ca3af", fontSize: "13px" }}>
            <span style={{ color: "#06b6d4" }}>◷</span> Performance
          </a>
        </nav>

        {/* User info + logout */}
        <div style={{ borderTop: "1px solid #1e3a5f", paddingTop: "12px", marginTop: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "12px", fontWeight: "bold" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: "white", fontSize: "12px", fontWeight: "500", margin: 0 }}>{user.name}</p>
              <p style={{ color: "#6b7280", fontSize: "11px", margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "6px", borderRadius: "6px",
            border: "1px solid #ef444430", background: "#ef444415",
            color: "#ef4444", cursor: "pointer", fontSize: "12px"
          }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, height: "100vh", overflowY: "auto", background: "#0a0f1e" }}>
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