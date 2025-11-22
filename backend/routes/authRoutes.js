const express = require("express");
const router = express.Router();
const { studentLogin, adminLogin } = require("../controllers/authController");

// Student login with matric
router.post("/student-login", studentLogin);

// Admin login
router.post("/admin-login", adminLogin);

module.exports = router;
