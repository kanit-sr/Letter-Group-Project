const express = require("express");

const {
  sendLetter,
  getInbox,
  getPublic,
  getUnreadCount,
  markRead,
} = require("../controllers/letter.controller");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// All letter endpoints require authentication.
router.use(requireAuth);

router.post("/", sendLetter);
router.get("/inbox", getInbox);
router.get("/public", getPublic);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markRead);

module.exports = router;
