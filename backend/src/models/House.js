const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    roofColor: {
      type: String,
      default: "#8B4513",
    },
    roofShape: {
      type: String,
      default: "gable",
    },
    doorStyle: {
      type: String,
      default: "classic",
    },
    wallColor: {
      type: String,
      default: "#E8D7C3",
    },
    wallPattern: {
      type: String,
      default: "plain",
    },
    gardenConfig: {
      type: Object,
      default: {},
    },
    mailboxStyle: {
      type: String,
      default: "default",
    },
    // v2 image/layer editor design (see house-implementation.md). Absent =
    // render the v1 procedural house. Stored as a free-form object; shape is
    // validated in utils/validateHouse.js before save.
    design: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("House", houseSchema);
