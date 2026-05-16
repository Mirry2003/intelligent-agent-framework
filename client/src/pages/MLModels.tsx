import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MLModels() {
  const { data: models, refetch } = trpc.mlModels.list.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("classification");
  const [algorithm, setAlgorithm] = useState("");

  const createModel = trpc.mlModels.create.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); setName(""); },
  });
  const trainModel = trpc.mlModels.train.useMutation({ onSuccess: () => refetch() });
  const deployModel = trpc.mlModels.deploy.useMutation({ onSuccess: () => refetch() });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "#22c55e";
      case "trained": return "#06b6d4";
      case "untrained": return "#6b7280";
      default: return "#f59e0b";
    }
  };

  return (
    <div style={{ padding: "24px", background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column", gap: "20px" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "white", margin: 0 }}>ML Models</h1>
          <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Train, evaluate and deploy machine learning models</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "8px 16px", borderRadius: "8px", border: "none",
          background: "#06b6d4", color: "white", cursor: "pointer",
          fontSize: "13px", fontWeight: "500"
        }}>
          {showForm ? "✕ Cancel" : "+ New Model"}
        </button>
      </div>

      {showForm && (
        <Card>
          <CardContent style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ color: "white", fontWeight: "600", margin: 0 }}>Create New Model</p>
            <input
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="Model Name" value={name} onChange={(e) => setName(e.target.value)} />
            <select
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              value={type} onChange={(e) => setType(e.target.value)}>
              <option value="classification">Classification</option>
              <option value="regression">Regression</option>
              <option value="clustering">Clustering</option>
              <option value="anomaly_detection">Anomaly Detection</option>
            </select>
            <input
              style={{ padding: "10px 12px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "#0d1626", color: "white", fontSize: "13px", outline: "none" }}
              placeholder="Algorithm (e.g. Random Forest)" value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)} />
            <button onClick={() => createModel.mutate({
              name, type: type as any, algorithm,
              trainingDataSize: 10000, epochs: 100, learningRate: 0.001,
            })} style={{
              padding: "10px", borderRadius: "8px", border: "none",
              background: "#06b6d4", color: "white", cursor: "pointer",
              fontSize: "13px", fontWeight: "500"
            }}>Create Model</button>
          </CardContent>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {models?.map((model) => (
          <Card key={model.id}>
            <CardContent style={{ padding: "20px" }}>
              
              {/* Model Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "10px",
                    background: "#06b6d420", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px"
                  }}>🧠</div>
                  <div>
                    <p style={{ color: "white", fontWeight: "600", fontSize: "15px", margin: 0 }}>{model.name}</p>
                    <p style={{ color: "#06b6d4", fontSize: "12px", margin: 0 }}>{model.type} · {model.algorithm || "Default"}</p>
                  </div>
                </div>
                <span style={{
                  fontSize: "12px", padding: "3px 10px", borderRadius: "999px",
                  color: getStatusColor(model.status),
                  background: getStatusColor(model.status) + "20"
                }}>{model.status}</span>
              </div>

              {/* Metrics */}
              {model.status !== "untrained" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                  {[
                    { label: "Accuracy", value: `${model.accuracy ?? 0}%`, color: "#22c55e" },
                    { label: "Precision", value: `${model.precision ?? 0}%`, color: "#06b6d4" },
                    { label: "Recall", value: `${model.recall ?? 0}%`, color: "#8b5cf6" },
                    { label: "F1 Score", value: `${model.f1Score ?? 0}%`, color: "#f59e0b" },
                  ].map((stat) => (
                    <div key={stat.label} style={{ padding: "10px", borderRadius: "8px", background: "#0d1626", textAlign: "center" }}>
                      <p style={{ fontWeight: "bold", fontSize: "15px", color: stat.color, margin: 0 }}>{stat.value}</p>
                      <p style={{ color: "#6b7280", fontSize: "11px", margin: "4px 0 0 0" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress Bar */}
              {model.status === "untrained" && (
                <div style={{ marginBottom: "16px", padding: "10px", borderRadius: "8px", background: "#0d1626" }}>
                  <p style={{ color: "#6b7280", fontSize: "12px", margin: "0 0 8px 0" }}>
                    Training Progress: {model.trainingProgress ?? 0}%
                  </p>
                  <div style={{ width: "100%", background: "#1e3a5f", borderRadius: "999px", height: "6px" }}>
                    <div style={{
                      height: "6px", borderRadius: "999px", background: "#06b6d4",
                      width: `${model.trainingProgress ?? 0}%`
                    }}></div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => trainModel.mutate({ id: model.id })}
                  disabled={model.status === "trained" || model.status === "deployed" || trainModel.isPending}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1px solid #06b6d430", background: "#06b6d420",
                    color: "#06b6d4", cursor: "pointer", fontSize: "13px", fontWeight: "500",
                    opacity: (model.status === "trained" || model.status === "deployed") ? 0.5 : 1
                  }}>
                  ▶ {trainModel.isPending ? "Training..." : "Train"}
                </button>
                <button
                  onClick={() => deployModel.mutate({ id: model.id })}
                  disabled={model.status !== "trained" || deployModel.isPending}
                  style={{
                    flex: 1, padding: "8px", borderRadius: "8px",
                    border: "1px solid #22c55e30", background: "#22c55e20",
                    color: "#22c55e", cursor: "pointer", fontSize: "13px", fontWeight: "500",
                    opacity: model.status !== "trained" ? 0.5 : 1
                  }}>
                  🚀 Deploy
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}