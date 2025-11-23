const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  qId: Number,
  text: String,
  type: { type: String, enum: ["objective", "theory"], default: "objective" },
  options: [String], // for objective
  // for objective: correctAnswer stored here
  correctAnswer: String,
  // for theory:
  modelAnswer: String,
  markingGuide: [
    {
      point: String,
      marks: Number,
      keywords: [String]
    }
  ],
  maxMarks: { type: Number, default: 10 }
});

const ExamSchema = new mongoose.Schema({
  courseCode: String,
  title: String,
  status: { type: String, enum: ["open", "closed"], default: "closed" },
  startAt: Date,
  durationObjMins: { type: Number, default: 30 },
  durationTheoryMins: { type: Number, default: 60 },
  questions: [QuestionSchema],
  proctoringRules: {
    maxWarnings: { type: Number, default: 3 }
  }
});

module.exports = mongoose.model("Exam", ExamSchema);
