import express from "express";
import cors from "cors";
import helmet from "helmet";
import eventRoutes from "./routes/event.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "audit-trail-backend",
    message: "Backend is running",
  });
});

app.use("/api/events", eventRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

export default app;