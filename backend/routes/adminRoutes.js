const express = require("express");
const router = express.Router();
const { createAdmin, uploadExam, listAttempts, rescheduleStudent } = require("../controllers/adminController");

router.post("/create-admin", createAdmin);
router.post("/upload-exam", uploadExam);
router.get("/attempts", listAttempts);
router.post("/reschedule", rescheduleStudent);

module.exports = router;
