const express = require("express");
const router = express.Router();
const { listAvailable, createExam, updateStatus } = require("../controllers/examController");

// public
router.get("/", listAvailable);

// admin
router.post("/", createExam);
router.patch("/:id/status", updateStatus);

module.exports = router;
