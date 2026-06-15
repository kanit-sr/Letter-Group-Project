const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const houseRoutes = require("./routes/house.routes");
const letterRoutes = require("./routes/letter.routes");
const assetRoutes = require("./routes/asset.routes");

const app = express();

app.use(cors());
// Houses can carry uploaded images as base64 data-URLs inside `design`, so the
// default 100kb JSON body limit is too small. Cap generously but below
// MongoDB's 16MB document limit.
app.use(express.json({ limit: "12mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    message: "Letter Village API is running",
    status: 200,
  });
});

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/houses", houseRoutes);
app.use("/api/v1/letters", letterRoutes);
app.use("/api/v1/assets", assetRoutes);

// 404 — unmatched routes
app.use((req, res) => {
  res.status(404).json({
    error: "NotFound",
    message: `Cannot ${req.method} ${req.originalUrl}`,
    status: 404,
  });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong",
    status,
  });
});

module.exports = app;
