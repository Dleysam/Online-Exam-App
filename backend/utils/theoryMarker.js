const axios = require("axios");

// Combines simple keyword scoring + OpenAI similarity scoring
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

async function callOpenAIForScoring(prompt) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  const res = await axios.post(
    "https://api.openai.com/v1/responses",
    {
      model: OPENAI_MODEL,
      input: prompt
    },
    { headers: { Authorization: `Bearer ${key}` } }
  );
  // Attempt to parse numeric score from response
  const raw = res.data;
  return raw;
}

function keywordScore(studentText, markingGuide) {
  // markingGuide: [{point, marks, keywords:[]}, ...]
  let totalPossible = 0;
  let totalAwarded = 0;
  markingGuide.forEach(point => {
    totalPossible += point.marks;
    const kws = (point.keywords || []).map(k => k.toLowerCase());
    const found = kws.filter(k => studentText.toLowerCase().includes(k)).length;
    // award proportional marks
    const awarded = point.keywords && point.keywords.length ? Math.round((found / point.keywords.length) * point.marks) : 0;
    totalAwarded += awarded;
  });
  return { awarded: totalAwarded, possible: totalPossible };
}

async function markTheory(studentAnswersArray, examQuestions) {
  // studentAnswersArray = [{ qId, answerText }, ...]
  let totalAwarded = 0;
  let totalPossible = 0;
  const perQuestion = [];

  for (const ans of studentAnswersArray) {
    const q = examQuestions.find(x => x.qId === ans.qId);
    if (!q) continue;

    const mg = q.markingGuide || [];
    const kw = keywordScore(ans.answerText || "", mg);
    // build OpenAI prompt
    const prompt = `
You are an impartial grader. Model answer: ${q.modelAnswer || ""}
Marking guide: ${JSON.stringify(mg)}
Student answer: ${ans.answerText || ""}
Return only JSON: {"score": <int>, "max": <int>, "notes":"short reasons"}
`;

    let llmScore = 0;
    try {
      const llmRes = await callOpenAIForScoring(prompt);
      // Try to extract a numeric score from llmRes if available - fallback to 0
      // We'll be conservative and not rely solely on LLM
      // Try to parse response text
      const text = JSON.stringify(llmRes);
      const m = text.match(/"score"\s*:\s*(\d+)/);
      if (m) llmScore = parseInt(m[1], 10);
    } catch (err) {
      console.warn("OpenAI scoring failed, using keywords only", err.message || err);
      llmScore = 0;
    }

    const alpha = 0.4; // weight for keyword score
    const max = q.maxMarks || 10;
    const kwNormalized = Math.round((kw.awarded / (kw.possible || max)) * max) || 0;
    const combined = Math.round(alpha * kwNormalized + (1 - alpha) * llmScore);
    const awarded = Math.max(0, Math.min(max, combined));

    totalAwarded += awarded;
    totalPossible += max;
    perQuestion.push({ qId: q.qId, awarded, max, kw: kw.awarded, llmScore });
  }

  return { totalAwarded, totalPossible, perQuestion };
}

module.exports = markTheory;
