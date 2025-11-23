const Exam = require("../models/Exam");

// list available (open) exams
exports.listAvailable = async (req, res) => {
  try {
    const exams = await Exam.find({ status: "open" });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// create an exam (admin)
exports.createExam = async (req, res) => {
  try {
    const exam = new Exam(req.body);
    await exam.save();
    res.json({ message: "Exam created", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// open/close exam
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // open or closed
    const exam = await Exam.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: "Status updated", exam });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
