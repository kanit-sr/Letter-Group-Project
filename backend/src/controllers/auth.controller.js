const User = require("../models/User");
const House = require("../models/House");
const { signToken } = require("../utils/jwt");

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "BadRequest",
        message: "username, email and password are required",
        status: 400,
      });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (exists) {
      return res.status(409).json({
        error: "Conflict",
        message: "A user with that email or username already exists",
        status: 409,
      });
    }

    const user = new User({ username, email });
    await user.setPassword(password);
    await user.save();

    // Every user gets a house with default customization.
    await House.create({ userId: user._id });

    const token = signToken({ sub: user._id.toString() });

    return res.status(201).json({
      data: { user, token },
      message: "Registered successfully",
      status: 201,
    });
  } catch (err) {
    return next(err);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: "BadRequest",
        message: "email and password are required",
        status: 400,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid email or password",
        status: 401,
      });
    }

    const token = signToken({ sub: user._id.toString() });

    return res.json({
      data: { user, token },
      message: "Logged in successfully",
      status: 200,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/v1/auth/me
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "NotFound",
        message: "User not found",
        status: 404,
      });
    }
    return res.json({ data: { user }, message: "OK", status: 200 });
  } catch (err) {
    return next(err);
  }
};

module.exports = { register, login, me };
