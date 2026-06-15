const House = require("../models/House");
const { validateHouseUpdate } = require("../utils/validateHouse");

// GET /api/v1/houses
// All houses with owner username/avatar — the village map data.
const listHouses = async (_req, res, next) => {
  try {
    const houses = await House.find()
      .populate("userId", "username avatarUrl")
      .lean();
    return res.json({
      data: { houses },
      message: "OK",
      status: 200,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/v1/houses/:userId
// A single neighbor's house.
const getHouseByUserId = async (req, res, next) => {
  try {
    const house = await House.findOne({ userId: req.params.userId })
      .populate("userId", "username avatarUrl")
      .lean();
    if (!house) {
      return res.status(404).json({
        error: "NotFound",
        message: "House not found",
        status: 404,
      });
    }
    return res.json({ data: { house }, message: "OK", status: 200 });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/v1/houses/me
// Update the authenticated user's house customization (protected).
const updateMyHouse = async (req, res, next) => {
  try {
    const { value, errors } = validateHouseUpdate(req.body);

    if (errors.length) {
      return res.status(400).json({
        error: "BadRequest",
        message: errors.join("; "),
        status: 400,
      });
    }

    const house = await House.findOneAndUpdate(
      { userId: req.user.id },
      { $set: value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate("userId", "username avatarUrl")
      .lean();

    return res.json({
      data: { house },
      message: "House updated",
      status: 200,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { listHouses, getHouseByUserId, updateMyHouse };
