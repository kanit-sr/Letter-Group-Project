const { verifyToken } = require("../utils/jwt");

// Verifies the Bearer token and attaches { id } to req.user.
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing or malformed Authorization header",
      status: 401,
    });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
      status: 401,
    });
  }
};

module.exports = { requireAuth };
