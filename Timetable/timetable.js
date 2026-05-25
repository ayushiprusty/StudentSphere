const subjectInput = document.getElementById("subjectInput");
const timeInput = document.getElementById("timeInput");
const daySelect = document.getElementById("daySelect");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const timetableList = document.getElementById("timetableList");

function saveSchedules(){
    const schedules = [];
    const cards = document.querySelectorAll(".schedule-card");
    cards.forEach(function(card){
        schedules.push({
            subject: card.querySelector(".schedule-subject").textContent,
            time: card.querySelector(".schedule-time").textContent,
            day: card.querySelector(".schedule-day").textContent
        });
    });
    localStorage.setItem("schedules", JSON.stringify(schedules));
}

function createSchedule(scheduleObj){
    const card = document.createElement("div");
    card.classList.add("schedule-card");
    const info = document.createElement("div");
    info.classList.add("schedule-info");
    const subject = document.createElement("h3");
    subject.textContent = scheduleObj.subject;
    subject.classList.add("schedule-subject");
    const time = document.createElement("p");
    time.textContent = scheduleObj.time;
    time.classList.add("schedule-time");
    const day = document.createElement("p");
    day.textContent = scheduleObj.day;
    day.classList.add("schedule-day");
    info.appendChild(subject);
    info.appendChild(time);
    info.appendChild(day);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-schedule");
    deleteBtn.addEventListener("click", function(){
        card.remove();
        updateEmptyTimetable();
        saveSchedules();
    });

    card.appendChild(info);
    card.appendChild(deleteBtn);
    timetableList.appendChild(card);
    updateEmptyTimetable();
    saveSchedules();
}

addScheduleBtn.addEventListener("click", function(){
    if(
        subjectInput.value.trim() === "" ||
        timeInput.value === ""
    ){
        showToast("Please fill all timetable fields.");
        return;
    }

    createSchedule({
        subject: subjectInput.value,
        time: timeInput.value,
        day: daySelect.value
    });
    subjectInput.value = "";
    timeInput.value = "";
});

window.addEventListener("load",function(){
        const savedSchedules =JSON.parse(localStorage.getItem("schedules")) || [];
        savedSchedules.forEach(function(scheduleObj){
            createSchedule(scheduleObj);
            updateEmptyTimetable();
});
    });

    function updateEmptyTimetable(){
    const emptyText =document.getElementById("emptyTimetable");
    const cards =document.querySelectorAll(".schedule-card");
    if(cards.length === 0){
       emptyText.style.display = "block";
    }
    else{
       emptyText.style.display = "none";
    }
}

function showToast(message){
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function(){
        toast.classList.remove("show");
    },2000);
}