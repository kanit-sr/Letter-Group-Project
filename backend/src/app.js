const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    message: "Letter Village API is running",
    status: 200,
  });
});

app.use("/api/v1/health", healthRoutes);

module.exports = app;
