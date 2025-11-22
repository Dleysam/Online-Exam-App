// exam.js
import { getAvailableExams, submitExam } from "./api.js";

let timerInterval;
let currentExamId;
const token = localStorage.getItem("token");

// -------------------- Load Exam Questions -------------------- //
export async function loadExam() {
    const questionsContainer = document.getElementById("questions-container");
    const timerDisplay = document.getElementById("timer");

    try {
        const exams = await getAvailableExams(token);
        if (exams.length === 0) return alert("No exam available at this time");

        const exam = exams[0]; // pick the first available exam
        currentExamId = exam._id;
        localStorage.setItem("currentExam", currentExamId);

        document.getElementById("exam-title").innerText = exam.title;

        // Display questions
        exam.questions.forEach((q, idx) => {
            const div = document.createElement("div");
            div.classList.add("question");
            div.dataset.id = q._id;

            // Check type: objective or theory
            if(q.type === "objective"){
                div.innerHTML = `
                    <p>${idx + 1}. ${q.text}</p>
                    ${q.options.map((opt, i) => `
                        <label>
                            <input type="radio" name="q${idx}" value="${opt}"> ${opt}
                        </label>
                    `).join("<br>")}
                `;
            } else { // theory
                div.innerHTML = `
                    <p>${idx + 1}. ${q.text}</p>
                    <textarea rows="4" placeholder="Type your answer"></textarea>
                `;
            }

            questionsContainer.appendChild(div);
        });

        // Set timer
        let duration = exam.type === "objective" ? 30 * 60 : 60 * 60; // 30 min obj, 60 min theory
        startTimer(duration, timerDisplay);
        initProctoring();

    } catch (err) {
        console.error(err);
        alert("Failed to load exam. Try again later.");
    }
}

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
    const answers = collectAnswers();
    try {
        const result = await submitExam(token, currentExamId, answers);
        alert(`Exam submitted! Your score: ${result.score}`);
        window.location.href = "result.html";
    } catch (err) {
        console.error(err);
        alert("Failed to submit exam. Try again.");
    }
}

// -------------------- Proctoring Warnings -------------------- //
export function initProctoring() {
    let warnings = 0;
    window.onblur = () => {
        warnings++;
        alert(`Warning ${warnings}/3: Tab minimized`);
        if(warnings >= 3) autoSubmitExam();
    };
    // Future: integrate camera & mic detection
}

// -------------------- Collect Answers -------------------- //
function collectAnswers(){
    let answers = {};
    document.querySelectorAll(".question").forEach(q => {
        const qid = q.dataset.id;
        const input = q.querySelector("input[type='radio']:checked") || q.querySelector("textarea");
        answers[qid] = input ? input.value : "";
    });
    return answers;
}

// -------------------- Event Listener -------------------- //
const examForm = document.getElementById("exam-form");
if(examForm){
    examForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearInterval(timerInterval); // stop timer on submit
        await autoSubmitExam();
    });
}

// -------------------- Initialize -------------------- //
window.addEventListener("DOMContentLoaded", loadExam);
