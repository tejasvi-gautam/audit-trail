import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import eventRoutes from "./routes/event.routes.js";
import { requestIdMiddleware } from "./middleware/request-id.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(requestIdMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "audit-trail-backend",
    message: "Backend is running",
  });
});

app.get("/health/ready", (_req, res) => {
  const databaseConnected = mongoose.connection.readyState === 1;

  return res.status(databaseConnected ? 200 : 503).json({
    success: databaseConnected,
    service: "audit-trail-backend",
    database: databaseConnected ? "connected" : "disconnected",
    message: databaseConnected
      ? "Backend is ready"
      : "Database is not ready",
  });
});

app.use("/api/events", eventRoutes);

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((error, _req, res, _next) => {
  if (error?.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload is too large",
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;