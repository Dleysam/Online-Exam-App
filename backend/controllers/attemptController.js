const Exam = require("../models/Exam");
const Attempt = require("../models/Attempt");
const Student = require("../models/Student");
const markObjective = require("../utils/objectiveMarker");
const markTheory = require("../utils/theoryMarker");

// submit attempt
exports.submitAttempt = async (req, res) => {
  try {
    const { examId, answers, warnings = {} } = req.body;
    const tokenMatric = req.body.matric || (req.user && req.user.matric) || null; // some clients may send matric
    const matric = tokenMatric || (req.user && req.user.matric) || req.body.matric;
    if (!matric) return res.status(400).json({ message: "Matric required" });

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    // Build answers arrays
    const objectiveAnswersMap = {};
    const theoryAnswersArray = [];

    // `answers` expected format: { "<qId>": "<answer>" , ... } for objective or theory
    for (const key of Object.keys(answers || {})) {
      const qId = parseInt(key, 10);
      const q = exam.questions.find(x => x.qId === qId);
      const val = answers[key];
      if (q && q.type === "objective") {
        objectiveAnswersMap[String(qId)] = val;
      } else {
        theoryAnswersArray.push({ qId, answerText: val });
      }
    }

    // Mark objective
    const objRes = markObjective(objectiveAnswersMap, exam);

    // Mark theory
    const theoryRes = await markTheory(theoryAnswersArray, exam.questions);

    // Compute totals
    const objectiveScore = objRes.score;
    const theoryScore = Math.round(theoryRes.totalAwarded);
    const totalScore = objectiveScore + theoryScore;

    // Build attempt document with per-question details
    const answersForAttempt = [];
    exam.questions.forEach(q => {
      const qstr = String(q.qId);
      if (q.type === "objective") {
        const studentAns = objectiveAnswersMap[qstr] || "";
        const correct = q.correctAnswer || null;
        const awardedObj = objRes.breakdown.find(b => b.qId === q.qId)?.awarded || 0;
        answersForAttempt.push({ qId: q.qId, answerText: studentAns, awarded: awardedObj, correctAnswer: correct });
      } else {
        const th = theoryRes.perQuestion.find(p => p.qId === q.qId) || {};
        const stud = (theoryAnswersArray.find(a => a.qId === q.qId) || {}).answerText || "";
        answersForAttempt.push({ qId: q.qId, answerText: stud, awarded: th.awarded || 0, correctAnswer: q.modelAnswer || null });
      }
    });

    const attempt = new Attempt({
      exam: exam._id,
      matric,
      startedAt: new Date(),
      completedAt: new Date(),
      objectiveScore,
      theoryScore,
      totalScore,
      answers: answersForAttempt,
      warnings,
      autoSubmitted: req.body.autoSubmitted || false
    });

    await attempt.save();

    // store attempt reference on student (optional)
    const student = await Student.findOne({ matric });
    if (student) {
      student.activeAttempt = null;
      await student.save();
    }

    res.json({
      success: true,
      score: totalScore,
      objectiveScore,
      theoryScore,
      attemptId: attempt._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// get result by attempt id
exports.getResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await Attempt.findById(attemptId).populate("exam");
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    // compute grade (example)
    const score = attempt.totalScore || 0;
    const grade = score >= 70 ? "A" : score >= 50 ? "B" : "C";

    res.json({
      examTitle: attempt.exam.title,
      score,
      grade,
      answers: attempt.answers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
