const mongoose = require("mongoose");

// Holds the in-memory server instance so we can stop it on shutdown.
let memoryServer = null;

const connectDB = async () => {
  // Demo/dev mode: spin up an in-memory MongoDB so the app runs with no
  // external database installed. Enable with USE_MEMORY_DB=true (or simply by
  // leaving MONGODB_URI unset).
  const useMemory =
    process.env.USE_MEMORY_DB === "true" || !process.env.MONGODB_URI;

  if (useMemory) {
    // Lazily required so production installs don't need the dev dependency.
    const { MongoMemoryServer } = require("mongodb-memory-server");
    memoryServer = await MongoMemoryServer.create();
    await mongoose.connect(memoryServer.getUri(), {
      dbName: process.env.MONGODB_DB || "letter_village",
    });
    console.log("MongoDB connected (in-memory demo server)");
    return;
  }

  const options = {};
  if (process.env.MONGODB_DB) {
    options.dbName = process.env.MONGODB_DB;
  }

  await mongoose.connect(process.env.MONGODB_URI, options);
  console.log("MongoDB connected");
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
