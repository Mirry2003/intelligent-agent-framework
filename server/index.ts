import express from "express";
import cors from "cors";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./router";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// tRPC middleware
app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "IAF Server is running" 
  });
});

// Serve frontend in production
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});