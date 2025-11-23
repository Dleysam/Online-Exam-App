const Exam = require("../models/Exam");
const Attempt = require("../models/Attempt");
const Student = require("../models/Student");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

// create admin (one-off helper) - secure this in production
exports.createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, passwordHash: hash });
    await admin.save();
    res.json({ message: "Admin created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// upload objective/theory answers or create exam
exports.uploadExam = async (req, res) => {
  try {
    const payload = req.body; // expect full exam schema
    const exam = new Exam(payload);
    await exam.save();
    res.json({ message: "Exam uploaded", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find().sort({ completedAt: -1 }).limit(200);
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rescheduleStudent = async (req, res) => {
  try {
    const { matric, examId, newStart } = req.body;
    // implementation idea: create a small override record or set exam.startAt for a specific student.
    // For simplicity we'll just return success; in production you'd store a reschedule collection.
    res.json({ message: "Reschedule recorded (implement storage)", matric, examId, newStart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
