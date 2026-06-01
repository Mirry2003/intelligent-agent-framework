import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface LoginProps {
  onLogin: (user: any, token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const url = isRegister ? "/api/register" : "/api/login";
      const body = isRegister ? { email, password, name } : { email, password };

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
      <Card style={{ width: "400px" }}>
        <CardContent style={{ padding: "32px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span style={{ fontSize: "32px" }}>⚡</span>
            <h1 style={{ color: "white", fontSize: "24px", fontWeight: "bold", margin: "8px 0 4px" }}>
              IAF Dashboard
            </h1>
            <p style={{ color: "#6b7280", fontSize: "13px" }}>
              {isRegister ? "Create your account" : "Sign in to continue"}
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
                placeholder="Full Name" value={name}
                onChange={(e) => setName(e.target.value)} />
            )}
            <input
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} />
            <input
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

            <button onClick={handleSubmit} disabled={loading}
              style={{
                padding: "12px", borderRadius: "8px", border: "none",
                background: "#06b6d4", color: "white", cursor: "pointer",
                fontSize: "14px", fontWeight: "600",
                opacity: loading ? 0.7 : 1
              }}>
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>

            <p style={{ color: "#6b7280", fontSize: "13px", textAlign: "center", margin: 0 }}>
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => { setIsRegister(!isRegister); setError(""); }}
                style={{ color: "#06b6d4", cursor: "pointer" }}>
                {isRegister ? "Sign In" : "Register"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}