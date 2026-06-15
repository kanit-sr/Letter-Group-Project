const express = require("express");
const { CATEGORIES, ASSETS } = require("../config/houseAssets");

const router = express.Router();

// GET /api/v1/assets — house-part catalog for the editor.
router.get("/", (_req, res) => {
  res.json({
    data: { categories: CATEGORIES, assets: ASSETS },
    message: "OK",
    status: 200,
  });
});

module.exports = router;
