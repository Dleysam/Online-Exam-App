import { getExamResult } from "./api.js";

const token = localStorage.getItem("token");

async function loadResult() {
    try {
        const result = await getExamResult(token);
        if (!result) return alert("No result found");

        // Display total score & grade
        const summary = document.getElementById("result-summary");
        summary.innerHTML = `
            <p><strong>Exam:</strong> ${result.examTitle}</p>
            <p><strong>Total Score:</strong> ${result.score}</p>
            <p><strong>Grade:</strong> ${result.grade}</p>
        `;

        // Detailed result (optional)
        const details = document.getElementById("detailed-results");
        result.answers.forEach((q, idx) => {
            const div = document.createElement("div");
            div.classList.add("question-result");
            div.innerHTML = `
                <p>${idx + 1}. ${q.question}</p>
                <p>Your Answer: ${q.studentAnswer}</p>
                <p>Correct Answer: ${q.correctAnswer || "AI graded"}</p>
                <p>Score: ${q.score}</p>
            `;
            details.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load result");
    }
}

// Dashboard button
document.getElementById("dashboard-btn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

// Initialize
window.addEventListener("DOMContentLoaded", loadResult);
