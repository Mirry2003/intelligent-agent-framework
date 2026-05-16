import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegacySystems() {
  const { data: systems, refetch } = trpc.legacySystems.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("erp");
  const [protocol, setProtocol] = useState("REST");
  const [dataFormat, setDataFormat] = useState("JSON");

  const createSystem = trpc.legacySystems.create.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); setName(""); },
  });
  const connectSystem = trpc.legacySystems.connect.useMutation({ onSuccess: () => refetch() });
  const disconnectSystem = trpc.legacySystems.disconnect.useMutation({ onSuccess: () => refetch() });
  const simulate = trpc.legacySystems.simulate.useMutation({ onSuccess: () => refetch() });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "#22c55e";
      case "disconnected": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>Legacy Systems</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Manage and monitor legacy system integrations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "8px 16px", borderRadius: "8px", border: "none",
          background: "#06b6d4", color: "white", cursor: "pointer",
          fontSize: "13px", fontWeight: "500"
        }}>
          {showForm ? "✕ Cancel" : "+ Add System"}
        </button>
      </div>

      {showForm && (
        <Card>
          <CardContent style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ color: "white", fontWeight: "600", margin: 0 }}>Add New System</p>
            <input
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="System Name" value={name} onChange={(e) => setName(e.target.value)} />
            <select style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              value={type} onChange={(e) => setType(e.target.value)}>
              <option value="erp">ERP</option>
              <option value="crm">CRM</option>
              <option value="database">Database</option>
              <option value="api">API</option>
              <option value="file_system">File System</option>
              <option value="custom">Custom</option>
            </select>
            <select style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              value={protocol} onChange={(e) => setProtocol(e.target.value)}>
              <option value="REST">REST</option>
              <option value="SOAP">SOAP</option>
              <option value="GraphQL">GraphQL</option>
              <option value="JDBC">JDBC</option>
              <option value="FTP">FTP</option>
              <option value="custom">Custom</option>
            </select>
            <select style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              value={dataFormat} onChange={(e) => setDataFormat(e.target.value)}>
              <option value="JSON">JSON</option>
              <option value="XML">XML</option>
              <option value="CSV">CSV</option>
              <option value="Binary">Binary</option>
              <option value="custom">Custom</option>
            </select>
            <button onClick={() => createSystem.mutate({
              name, type: type as any, protocol: protocol as any, dataFormat: dataFormat as any
            })} style={{
              padding: "10px", borderRadius: "8px", border: "none",
              background: "#06b6d4", color: "white", cursor: "pointer",
              fontSize: "13px", fontWeight: "500"
            }}>Create System</button>
          </CardContent>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {systems?.map((system) => (
          <Card key={system.id}>
            <CardContent style={{ padding: "20px" }}>

              {/* System Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "#f59e0b20", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px"
                  }}>🔗</div>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>{system.name}</p>
                    <p style={{ color: "#6b7280", fontSize: "12px", margin: 0 }}>{system.type} · {system.protocol}</p>
                  </div>
                </div>
                <span style={{
                  fontSize: "12px", padding: "3px 10px", borderRadius: "999px",
                  color: getStatusColor(system.status),
                  background: getStatusColor(system.status) + "20"
                }}>{system.status}</span>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                {[
                  { label: "Latency", value: `${system.latency ?? 0}ms`, color: "#06b6d4" },
                  { label: "Error Rate", value: `${system.errorRate?.toFixed(1) ?? 0}%`, color: "#ef4444" },
                  { label: "Format", value: system.dataFormat, color: "#8b5cf6" },
                ].map((stat) => (
                  <div key={stat.label} style={{ padding: "10px", borderRadius: "8px", background: "#0d1626", textAlign: "center" }}>
                    <p style={{ fontWeight: "bold", fontSize: "14px", color: stat.color, margin: 0 }}>{stat.value}</p>
                    <p style={{ color: "#6b7280", fontSize: "11px", margin: "4px 0 0 0" }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => connectSystem.mutate({ id: system.id })}
                  disabled={system.status === "connected"}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1px solid #22c55e30", background: "#22c55e20",
                    color: "#22c55e", cursor: "pointer", fontSize: "13px",
                    opacity: system.status === "connected" ? 0.5 : 1
                  }}>⚡ Connect</button>
                <button onClick={() => disconnectSystem.mutate({ id: system.id })}
                  disabled={system.status === "disconnected"}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1px solid #ef444430", background: "#ef444420",
                    color: "#ef4444", cursor: "pointer", fontSize: "13px",
                    opacity: system.status === "disconnected" ? 0.5 : 1
                  }}>✕ Disconnect</button>
                <button onClick={() => simulate.mutate({ id: system.id, action: "sync" })}
                  disabled={system.status !== "connected"}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1px solid #06b6d430", background: "#06b6d420",
                    color: "#06b6d4", cursor: "pointer", fontSize: "13px",
                    opacity: system.status !== "connected" ? 0.5 : 1
                  }}>🔄 Sync</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}