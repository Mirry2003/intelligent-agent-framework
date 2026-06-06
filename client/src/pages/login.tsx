import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async () => {
  setLoading(true);
  setError("");
  try {
    const response = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: "admin@iaf.com",
        password: "Admin@2026",
      }),
    });

    const text = await response.text();
    const data = JSON.parse(text);
    if (!response.ok) throw new Error(data.error);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    onLogin(data.user, data.token);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const url = isRegister 
        ? "http://localhost:3001/api/register" 
        : "http://localhost:3001/api/login";
      const body = isRegister
        ? { email, password, name }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      if (isRegister) {
        setIsRegister(false);
        setError("Registration successful! Please login.");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user, data.token);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "100vh", background: "#0a0f1e"
    }}>
      <div style={{ width: "420px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Admin Quick Login Card */}
        <Card>
          <CardContent style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>👑</span>
              <div>
                <p style={{ color: "white", fontWeight: "600", fontSize: "14px", margin: 0 }}>
                  Admin Access
                </p>
                <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>
                  Quick login as System Administrator
                </p>
              </div>
            </div>
            <button
              onClick={handleAdminLogin}
              disabled={loading}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid #06b6d430", background: "#06b6d420",
                color: "#06b6d4", cursor: "pointer", fontSize: "13px",
                fontWeight: "600", opacity: loading ? 0.7 : 1
              }}>
              {loading ? "Logging in..." : "⚡ Login as Admin"}
            </button>
          </CardContent>
        </Card>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#1e3a5f" }}></div>
          <span style={{ color: "#6b7280", fontSize: "12px" }}>or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "#1e3a5f" }}></div>
        </div>

        {/* Regular Login Card */}
        <Card>
          <CardContent style={{ padding: "24px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "28px" }}>⚡</span>
              <h1 style={{ color: "white", fontSize: "20px", fontWeight: "bold", margin: "8px 0 4px" }}>
                IAF Dashboard
              </h1>
              <p style={{ color: "#6b7280", fontSize: "12px" }}>
                {isRegister ? "Create your account" : "Sign in to your account"}
              </p>
            </div>

            {error && (
              <div style={{
                padding: "10px", borderRadius: "8px", marginBottom: "16px",
                background: error.includes("successful") ? "#22c55e20" : "#ef444420",
                color: error.includes("successful") ? "#22c55e" : "#ef4444",
                fontSize: "13px", textAlign: "center"
              }}>{error}</div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {isRegister && (
                <input
                  style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
              )}
              <input
                style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
                placeholder="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              <input
                style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  padding: "12px", borderRadius: "8px", border: "none",
                  background: "#1e3a5f", color: "white", cursor: "pointer",
                  fontSize: "14px", fontWeight: "600",
                  opacity: loading ? 0.7 : 1
                }}>
                {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
              </button>

              <p style={{ color: "#6b7280", fontSize: "12px", textAlign: "center", margin: 0 }}>
                {isRegister ? "Already have an account? " : "Don't have an account? "}
                <span
                  onClick={() => { setIsRegister(!isRegister); setError(""); }}
                  style={{ color: "#06b6d4", cursor: "pointer" }}>
                  {isRegister ? "Sign In" : "Register"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin credentials hint */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#4b5563", fontSize: "11px", margin: 0 }}>
            Admin: admin@iaf.com | Admin@2026
          </p>
        </div>
      </div>
    </div>
  );
}