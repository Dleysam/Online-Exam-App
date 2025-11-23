const jwt = require("jsonwebtoken");

/**
 * Verifies JWT token for:
 *  - Students (token contains matric)
 *  - Admins (token contains adminId)
 */
module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // => { matric: "..."} or { adminId: "..." }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
