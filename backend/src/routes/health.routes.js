const express = require("express");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    data: {
      ok: true,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    message: "API is healthy",
    status: 200,
  });
});

module.exports = router;
