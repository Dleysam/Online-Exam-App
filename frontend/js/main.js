// main.js

import { studentLogin, adminLogin } from "./api.js";

// -------------------- Student Login -------------------- //
const studentForm = document.getElementById("student-login-form");
if(studentForm){
    studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const matric = document.getElementById("matric").value;
        const data = await studentLogin(matric);

        if(data.token){
            localStorage.setItem("token", data.token);
            localStorage.setItem("student", JSON.stringify(data.student));
            window.location.href = "dashboard.html";
        } else {
            document.getElementById("login-message").innerText = data.message;
        }
    });
}

// -------------------- Admin Login -------------------- //
const adminForm = document.getElementById("admin-login-form");
if(adminForm){
    adminForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const data = await adminLogin(username, password);

        if(data.token){
            localStorage.setItem("token", data.token);
            window.location.href = "admin/dashboard.html";
        } else {
            document.getElementById("login-message").innerText = data.message;
        }
    });
}
