const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    matric: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: String },
    status: { type: String, default: "active" }
});

module.exports = mongoose.model("Student", studentSchema);
