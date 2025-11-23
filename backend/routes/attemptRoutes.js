const express = require("express");
const router = express.Router();
const { submitAttempt, getResult } = require("../controllers/attemptController");

// submit attempt
router.post("/submit", submitAttempt);

// get result
router.get("/:attemptId/result", getResult);

module.exports = router;
