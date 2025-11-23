const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  qId: Number,
  answerText: String,
  awarded: { type: Number, default: 0 },
  correctAnswer: String
});

const AttemptSchema = new mongoose.Schema({
  exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  matric: String,
  startedAt: Date,
  completedAt: Date,
  objectiveScore: Number,
  theoryScore: Number,
  totalScore: Number,
  answers: [AnswerSchema],
  warnings: {
    camera: { type: Number, default: 0 },
    mic: { type: Number, default: 0 },
    tabSwitches: { type: Number, default: 0 }
  },
  autoSubmitted: { type: Boolean, default: false },
  adminOverride: { type: Number, default: null }
});

module.exports = mongoose.model("Attempt", AttemptSchema);
