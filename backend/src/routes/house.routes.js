const express = require("express");

const {
  listHouses,
  getHouseByUserId,
  updateMyHouse,
} = require("../controllers/house.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", listHouses);
router.put("/me", requireAuth, updateMyHouse);
router.get("/:userId", getHouseByUserId);

module.exports = router;
