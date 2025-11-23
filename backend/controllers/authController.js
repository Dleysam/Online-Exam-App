const Student = require("../models/Student");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// student login by matric only
exports.studentLogin = async (req, res) => {
  const { matric } = req.body;
  try {
    if (!matric) return res.status(400).json({ message: "Matric required" });
    const student = await Student.findOne({ matric });
    if (!student) return res.status(404).json({ message: "Matric not found" });

    const token = jwt.sign({ matric }, process.env.JWT_SECRET, { expiresIn: "4h" });
    res.json({ token, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// admin login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    const ok = await admin.isValidPassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "8h" });
    res.json({ token, admin: { username: admin.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
