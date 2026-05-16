import express from "express";
import cors from "cors";
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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});