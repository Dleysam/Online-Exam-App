import { getAllStudentScores } from "./api.js";

const token = localStorage.getItem("token");

async function loadStudentScores() {
    try {
        const scores = await getAllStudentScores(token);
        if (!scores || scores.length === 0) return alert("No scores available");

        const container = document.getElementById("student-scores");

        // Build table
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Matric Number</th>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Grade</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${scores.map(s => `
                    <tr>
                        <td>${s.matric}</td>
                        <td>${s.examTitle}</td>
                        <td>${s.score}</td>
                        <td>${s.grade}</td>
                        <td>
                            <button class="view-btn" data-id="${s._id}">View</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        `;
        container.appendChild(table);

        // Optional: Add view button functionality
        container.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const studentId = btn.dataset.id;
                window.location.href = `view-result.html?studentId=${studentId}`;
            });
        });

    } catch (err) {
        console.error(err);
        alert("Failed to load student scores");
    }
}

window.addEventListener("DOMContentLoaded", loadStudentScores);
