// api.js
const BASE_URL = "https://your-backend-url/api";

// -------------------- Student -------------------- //
export async function studentLogin(matric) {
    const res = await fetch(`${BASE_URL}/auth/student-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matric })
    });
    return await res.json();
}

// -------------------- Admin -------------------- //
export async function adminLogin(username, password) {
    const res = await fetch(`${BASE_URL}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    return await res.json();
}

// -------------------- Exams -------------------- //
export async function getAvailableExams(token) {
    const res = await fetch(`${BASE_URL}/exams`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return await res.json();
}

export async function submitExam(token, examId, answers) {
    const res = await fetch(`${BASE_URL}/attempts/submit`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ examId, answers })
    });
    return await res.json();
}

// -------------------- Admin Actions -------------------- //
export async function uploadObjective(token, examId, questions) {
    const res = await fetch(`${BASE_URL}/admin/upload-objective`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ examId, questions })
    });
    return await res.json();
}

export async function uploadTheory(token, examId, answers) {
    const res = await fetch(`${BASE_URL}/admin/upload-theory`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ examId, answers })
    });
    return await res.json();
}
