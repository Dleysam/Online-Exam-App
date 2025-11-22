// theoryMarker.js
// Simple keyword + AI scoring logic
async function markTheory(studentAnswers, modelAnswers) {
    let totalScore = 0;

    for(let i=0; i<studentAnswers.length; i++){
        const studentAns = studentAnswers[i];
        const modelAns = modelAnswers[i];

        // Simple keyword matching
        const keywords = modelAns.split(" "); // split into words
        let matches = 0;
        keywords.forEach(word => {
            if(studentAns.toLowerCase().includes(word.toLowerCase())){
                matches++;
            }
        });

        const keywordScore = (matches / keywords.length) * 100;
        // Optional: combine with AI scoring (call OpenAI API)
        totalScore += keywordScore;
    }

    // Average across all questions
    return totalScore / studentAnswers.length;
}

module.exports = markTheory;
