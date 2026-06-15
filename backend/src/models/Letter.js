const mongoose = require("mongoose");

const letterSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // optional: public letters (community board) have no single recipient
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    designConfig: {
      type: Object,
      default: {},
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Common access patterns: a user's inbox and the public board, newest first.
letterSchema.index({ recipientId: 1, sentAt: -1 });
letterSchema.index({ isPublic: 1, sentAt: -1 });

module.exports = mongoose.model("Letter", letterSchema);
