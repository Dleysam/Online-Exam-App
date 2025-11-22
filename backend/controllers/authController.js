const Student = require("../models/Student");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Student Login
exports.studentLogin = async (req, res) => {
    const { matric } = req.body;
    try {
        const student = await Student.findOne({ matric });
        if (!student) return res.status(404).json({ message: "Matric not found" });

        // Create JWT
        const token = jwt.sign({ matric }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ token, student });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin Login
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const valid = await admin.isValidPassword(password);
        if (!valid) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ token, admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
