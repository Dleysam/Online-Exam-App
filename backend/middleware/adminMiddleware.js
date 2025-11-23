/**
 * Ensures the request comes from a valid admin.
 * Works together with authMiddleware (which decodes token).
 */
module.exports = (req, res, next) => {
  try {
    if (!req.user || !req.user.adminId) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Admin verification failed" });
  }
};
