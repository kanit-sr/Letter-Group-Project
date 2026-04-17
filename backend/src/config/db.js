const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  const options = {};

  if (process.env.MONGODB_DB) {
    options.dbName = process.env.MONGODB_DB;
  }

  await mongoose.connect(uri, options);
  console.log("MongoDB connected");
};

module.exports = connectDB;
