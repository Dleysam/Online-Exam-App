// objectiveMarker.js
function markObjective(studentAnswers, correctAnswers) {
    let score = 0;
    studentAnswers.forEach((ans, idx) => {
        if(ans.trim().toLowerCase() === correctAnswers[idx].trim().toLowerCase()){
            score++;
        }
    });
    return score;
}

module.exports = markObjective;
