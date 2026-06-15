require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { disconnectDB } = require("./config/db");
const seedDemoData = require("./seed/seed");

const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    // Seed demo accounts/letters from src/seed/demoData.js. On by default in
    // in-memory demo mode; force with SEED_DEMO=true, disable with SEED_DEMO=false.
    const useMemory =
      process.env.USE_MEMORY_DB === "true" || !process.env.MONGODB_URI;
    const shouldSeed =
      process.env.SEED_DEMO === "true" ||
      (useMemory && process.env.SEED_DEMO !== "false");
    if (shouldSeed) {
      await seedDemoData();
    }

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
