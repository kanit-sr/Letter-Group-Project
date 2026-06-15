const mongoose = require("mongoose");
const Letter = require("../models/Letter");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/v1/letters
// Send a letter. Public letters go to the community board (no recipient);
// private letters require a recipientId.
const sendLetter = async (req, res, next) => {
  try {
    const { recipientId, subject, body, designConfig, isPublic } =
      req.body || {};

    if (!subject || !body) {
      return res.status(400).json({
        error: "BadRequest",
        message: "subject and body are required",
        status: 400,
      });
    }

    if (!isPublic) {
      if (!recipientId || !isValidId(recipientId)) {
        return res.status(400).json({
          error: "BadRequest",
          message: "A valid recipientId is required for a private letter",
          status: 400,
        });
      }
    }

    const letter = await Letter.create({
      senderId: req.user.id,
      recipientId: isPublic ? undefined : recipientId,
      subject,
      body,
      designConfig: designConfig || {},
      isPublic: Boolean(isPublic),
    });

    return res.status(201).json({
      data: { letter },
      message: "Letter sent",
      status: 201,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/v1/letters/inbox
// Private letters addressed to the authenticated user, newest first.
const getInbox = async (req, res, next) => {
  try {
    const letters = await Letter.find({
      recipientId: req.user.id,
      isPublic: false,
    })
      .populate("senderId", "username avatarUrl")
      .sort({ sentAt: -1 })
      .lean();

    return res.json({ data: { letters }, message: "OK", status: 200 });
  } catch (err) {
    return next(err);
  }
};

// GET /api/v1/letters/public
// Community board — all public letters, newest first.
const getPublic = async (_req, res, next) => {
  try {
    const letters = await Letter.find({ isPublic: true })
      .populate("senderId", "username avatarUrl")
      .sort({ sentAt: -1 })
      .lean();

    return res.json({ data: { letters }, message: "OK", status: 200 });
  } catch (err) {
    return next(err);
  }
};

// GET /api/v1/letters/unread-count
// Count of unread private letters — for the mailbox/notification badge.
const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Letter.countDocuments({
      recipientId: req.user.id,
      isPublic: false,
      isRead: false,
    });

    return res.json({ data: { count }, message: "OK", status: 200 });
  } catch (err) {
    return next(err);
  }
};

// PATCH /api/v1/letters/:id/read
// Mark a received letter as read. Only the recipient may do this.
const markRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({
        error: "BadRequest",
        message: "Invalid letter id",
        status: 400,
      });
    }

    const letter = await Letter.findOneAndUpdate(
      { _id: id, recipientId: req.user.id },
      { $set: { isRead: true } },
      { new: true }
    ).lean();

    if (!letter) {
      return res.status(404).json({
        error: "NotFound",
        message: "Letter not found in your inbox",
        status: 404,
      });
    }

    return res.json({ data: { letter }, message: "Marked as read", status: 200 });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  sendLetter,
  getInbox,
  getPublic,
  getUnreadCount,
  markRead,
};
