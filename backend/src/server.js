import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./db/connect.js";

let server;

const startServer = async () => {
  try {
    await connectDatabase();

    server = app.listen(env.port, () => {
      console.log(
        `Audit Trail backend running on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server...`);

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();