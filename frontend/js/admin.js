// admin.js
import { uploadObjective, uploadTheory } from "../js/api.js";

const uploadObjForm = document.getElementById("upload-objective-form");
if(uploadObjForm){
    uploadObjForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const examId = document.getElementById("exam-id").value;
        const questions = JSON.parse(document.getElementById("questions").value);
        const token = localStorage.getItem("token");
        const res = await uploadObjective(token, examId, questions);
        alert(res.message);
    });
}

const uploadTheoryForm = document.getElementById("upload-theory-form");
if(uploadTheoryForm){
    uploadTheoryForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const examId = document.getElementById("exam-id").value;
        const answers = JSON.parse(document.getElementById("answers").value);
        const token = localStorage.getItem("token");
        const res = await uploadTheory(token, examId, answers);
        alert(res.message);
    });
}
