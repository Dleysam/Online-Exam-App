// exact match scoring for objective questions
function markObjective(studentAnswersMap, exam) {
  // studentAnswersMap: { qId: "A", ... }
  let score = 0;
  const breakdown = [];

  exam.questions.filter(q => q.type === "objective").forEach(q => {
    const answer = (studentAnswersMap[String(q.qId)] || "").toString().trim().toLowerCase();
    const correct = (q.correctAnswer || "").toString().trim().toLowerCase();
    const awarded = answer && answer === correct ? 1 : 0;
    score += awarded;
    breakdown.push({ qId: q.qId, awarded, correctAnswer: q.correctAnswer || null });
  });

  return { score, breakdown };
}

module.exports = markObjective;
