const subjectInput = document.getElementById("subjectInput");
const totalClassesInput = document.getElementById("totalClassesInput");
const attendedClassesInput = document.getElementById("attendedClassesInput");
const addAttendanceBtn = document.getElementById("addAttendanceBtn");
const attendanceList = document.getElementById("attendanceList");

function saveAttendance(){
    const attendanceData = [];

    const cards = document.querySelectorAll(".attendance-card");

    cards.forEach(function(card){
    console.log(card.querySelector(".attendance-total").textContent);
    console.log(card.querySelector(".attendance-attended").textContent);

        attendanceData.push({
            subject: card.querySelector(".attendance-subject").textContent,
            total: card.querySelector(".attendance-total").textContent,
            attended: card.querySelector(".attendance-attended").textContent,
            percentage: card.querySelector(".attendance-percentage").textContent
        });

    });

    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}

function createAttendanceCard(attendanceObj){

    const card = document.createElement("div");
    card.classList.add("attendance-card");

    const subject = document.createElement("h3");
    subject.textContent = attendanceObj.subject;
    subject.classList.add("attendance-subject");

    const total = document.createElement("p");
    total.innerHTML = "" + attendanceObj.total;
    total.classList.add("attendance-total");

    const attended = document.createElement("p");
    attended.innerHTML = " " + attendanceObj.attended;
    attended.classList.add("attendance-attended");

    const percentage = document.createElement("p");
    percentage.textContent = attendanceObj.percentage;
    percentage.classList.add("attendance-percentage");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");

    const progressFill = document.createElement("div");
    progressFill.classList.add("progress-fill");

    progressFill.style.width = attendanceObj.percentage;

    if(parseInt(attendanceObj.percentage) < 75){
        progressFill.style.background = "crimson";
    }

    progressBar.appendChild(progressFill);

    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";

    deleteBtn.style.marginTop = "15px";
    deleteBtn.style.padding = "10px 16px";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "8px";
    deleteBtn.style.backgroundColor = "crimson";
    deleteBtn.style.color = "white";
    deleteBtn.style.cursor = "pointer";

    deleteBtn.addEventListener("click", function(){

        card.remove();

        saveAttendance();
        updateOverallAttendance();

    });

    card.appendChild(subject);
    card.appendChild(total);
    card.appendChild(attended);
    card.appendChild(percentage);
    card.appendChild(progressBar);
    card.appendChild(deleteBtn);

    attendanceList.appendChild(card);

    saveAttendance();
    updateOverallAttendance();
}

addAttendanceBtn.addEventListener("click", function(){

    if(
        subjectInput.value.trim() === "" ||
        totalClassesInput.value === "" ||
        attendedClassesInput.value === ""
    ){
        alert("Please fill all attendance fields.");
        return;
    }

    const totalClasses = Number(totalClassesInput.value);

    const attendedClasses = Number(attendedClassesInput.value);
    if(attendedClasses > totalClasses){

    alert("Attended classes cannot be greater than total classes.");

    return;
}

    const percentageValue = Math.round((attendedClasses / totalClasses) * 100);

    createAttendanceCard({
        subject: subjectInput.value,
        total: "Total Classes: " + totalClasses,
        attended: "Classes Attended: " + attendedClasses,
        percentage: percentageValue + "%"
    });

    subjectInput.value = "";
    totalClassesInput.value = "";
    attendedClassesInput.value = "";
});

window.addEventListener("load", function(){

    const savedAttendance = JSON.parse(localStorage.getItem("attendanceData")) || [];

    savedAttendance.forEach(function(attendanceObj){

        createAttendanceCard(attendanceObj);

    });
    updateOverallAttendance();

});

function updateOverallAttendance(){

    const cards = document.querySelectorAll(".attendance-card");

    let totalClasses = 0;
    let attendedClasses = 0;

    cards.forEach(function(card){

        totalClasses += Number(
        card.querySelector(".attendance-total")
        .textContent.replace("Total Classes: ","")
    );

        attendedClasses += Number(
            card.querySelector(".attendance-attended")
            .textContent.replace("Classes Attended: ","")
        );
    });

    const percentage =
        totalClasses === 0
        ? 0
        : Math.round((attendedClasses / totalClasses) * 100);

    document.getElementById("overallPercentage").textContent =
        percentage + "%";

    document.getElementById("overallProgress").style.width =
        percentage + "%";

    localStorage.setItem("overallAttendance",percentage);
}