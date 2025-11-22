// exam.js
import { submitExam } from "./api.js";

let timerInterval;

// -------------------- Timer -------------------- //
export function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        display.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        if (--timer < 0) {
            clearInterval(timerInterval);
            autoSubmitExam();
        }
    }, 1000);
}

// -------------------- Auto-submit Exam -------------------- //
export async function autoSubmitExam() {
    const token = localStorage.getItem("token");
    const examId = localStorage.getItem("currentExam");
    const answers = collectAnswers(); // implement to read from page
    const result = await submitExam(token, examId, answers);
    window.location.href = "result.html";
}

// -------------------- Proctoring Warnings (stub) -------------------- //
export function initProctoring() {
    let warnings = 0;
    window.onblur = () => {
        warnings++;
        alert(`Warning ${warnings}/3: Tab minimized`);
        if(warnings >= 3) autoSubmitExam();
    };
    // Camera & mic logic can be added later
}

// -------------------- Collect Answers -------------------- //
function collectAnswers(){
    // Example: collect objective & theory answers from page
    let answers = {};
    document.querySelectorAll(".question").forEach(q => {
        const qid = q.dataset.id;
        answers[qid] = q.querySelector("input, textarea").value;
    });
    return answers;
}
