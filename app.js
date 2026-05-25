function saveTasks(){
    const allTasks = [];
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(function(task){
        allTasks.push({
            text:task.querySelector(".task-text").textContent,
            completed:task.classList.contains("completed"),
            priority: task.querySelector(".priority-tag").textContent,
            dueDate: task.querySelector(".due-date").textContent.replace("Due: ","")
        });
    });
    localStorage.setItem("tasks",JSON.stringify(allTasks));
}

const taskInput = document.getElementById("taskInput");
const addTaskbtn = document.getElementById("addTaskbtn");
const searchTask = document.getElementById("searchTask");
const sortTasks = document.getElementById("sortTasks");
const prioritySelect = document.getElementById("prioritySelect");
const dueDateInput = document.getElementById("dueDateInput");
const taskList = document.getElementById("taskList");

function showToast(message){
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function(){
        toast.classList.remove("show");
    },2000);
}

function createTaskElement(taskObj){

    const li = document.createElement("li");

    const taskSpan = document.createElement("span");
    taskSpan.classList.add("task-text");
    taskSpan.textContent = taskObj.text;
    const priorityTag = document.createElement("span");
    priorityTag.textContent = taskObj.priority;
    priorityTag.classList.add("priority-tag");
    priorityTag.classList.add(taskObj.priority.toLowerCase());
    const dueDateTag = document.createElement("span");
    dueDateTag.classList.add("due-date");
    if(taskObj.dueDate){
        dueDateTag.textContent = "Due: " + taskObj.dueDate;
    }
    if(taskObj.completed){
        li.classList.add("completed");
    }

    taskSpan.addEventListener("click", function(e){
        e.stopPropagation();

        li.classList.toggle("completed");
        checkOverdueTasks();

        saveTasks();
        updateTaskCount();
        updateAttendance();
        updateProductivity();
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", function(e){
        e.stopPropagation();

        if(li.classList.contains("completed")){
             showToast("Cannot edit a completed task.");
            return;
        }

        enableEditMode(li, taskSpan);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function(e){
        e.stopPropagation();

        if(li.classList.contains("completed")){
            showToast( "Cannot delete a completed task.");
            return;
        }

        li.remove();

        saveTasks();
        updateTaskCount();
        updateAttendance();
        updateEmptyState();
        updateProductivity();
    });

    li.appendChild(taskSpan);
    li.appendChild(priorityTag);
    li.appendChild(dueDateTag);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
    updateEmptyState();
}
    function addTask(){

    const taskText = taskInput.value;

    const taskMessage = document.getElementById("taskMessage");

    if(taskText.trim() === ""){
        showToast("Please enter a valid task.");
        return;
    }

    const existingTasks = document.querySelectorAll("#taskList li");

    for(let task of existingTasks){

        if(task.querySelector(".task-text").textContent.trim().toLowerCase() === taskText.trim().toLowerCase()){

            showToast("Task already exists.");

            return;
        }
    }

    createTaskElement({
        text: taskText,
        completed: false,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value
    });

    showToast("");

    saveTasks();
    updateTaskCount();
    updateAttendance();
    checkOverdueTasks();
    updateProductivity();
    taskInput.value = "";

    taskInput.placeholder = "Enter a task";
}
addTaskbtn.addEventListener("click",function(){
    addTask();
});
taskInput.addEventListener("keydown", function(event){

    if(event.key === "Enter"){

        addTask();
    }
});
window.addEventListener("load",function(){
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(function(taskObj){
       createTaskElement(taskObj);
 });
updateTaskCount();
updateAttendance();
checkOverdueTasks();
updateProductivity();
const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){
    document.body.classList.add("light-mode");
}
});
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click",function(){
    document.body.classList.toggle("light-mode");
     if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

    }
    else{

        localStorage.setItem("theme","dark");
    }
});
const progressFill = document.querySelector(".progress-fill");
const attendanceText = document.getElementById("attendanceText");
let attendance = 82;
progressFill.style.width = attendance + "%";
attendanceText.textContent = attendance + "%";

function updateEmptyState(){
    const emptyState = document.getElementById("emptyState");
    const totalTasks = document.querySelectorAll("#taskList li").length;
    if(totalTasks === 0){
       emptyState.style.display = "block";
    }
    else{
       emptyState.style.display = "none";
    }
}

function updateTaskCount(){
    const pendingTasks = document.querySelectorAll("#taskList li:not(.completed)").length;
    const taskCount = document.getElementById("taskCount");
    taskCount.textContent = pendingTasks + " Tasks";
    updateEmptyState();
}
function updateAttendance(){
    const totalTasks = document.querySelectorAll("#taskList li").length;
    const completedTasks = document.querySelectorAll("#taskList li.completed").length;
    let attendance = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    progressFill.style.width = attendance + "%";
    attendanceText.textContent = attendance + "%";
}

function updateProductivity(){
    const totalTasks = document.querySelectorAll("#taskList li").length;
    const completedTasks = document.querySelectorAll("#taskList li.completed").length;
    const productivityText = document.getElementById("productivityText");
    let productivity = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    productivityText.textContent = productivity + "%";
}

 function checkOverdueTasks(){
    const today = new Date().toISOString().split("T")[0];
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(function(task){
        const dueDateText = task.querySelector(".due-date").textContent.replace("Due: ","");
        if(dueDateText && dueDateText < today && !task.classList.contains("completed")){
           task.classList.add("overdue");
         }
        else{
           task.classList.remove("overdue");
        }
    });
}

function enableEditMode(li,taskSpan){
    const priorityTag = li.querySelector(".priority-tag");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");
    const oldText = taskSpan.textContent;
    const input = document.createElement("input");
    input.classList.add("edit-input");
    input.value=oldText;
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.classList.add("save-btn");
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.classList.add("cancel-btn");
        taskSpan.style.display = "none";
        priorityTag.style.display = "none";
        editBtn.style.display = "none";
        deleteBtn.style.display = "none";
        li.appendChild(input);
        li.appendChild(saveBtn);
        li.appendChild(cancelBtn);
        function cleanup(){
            input.remove();
            saveBtn.remove();
            cancelBtn.remove();
            taskSpan.style.display = "inline",
            priorityTag.style.display = "inline";
            editBtn.style.display = "inline";
            deleteBtn.style.display = "inline";
        }
        saveBtn.addEventListener("click",function(e){
            e.stopPropagation();
            const newValue = input.value.trim();
            if(newValue !== ""){
                taskSpan.textContent = newValue;
                saveTasks();
            }
            cleanup();
        });
        cancelBtn.addEventListener("click",function(e){
            e.stopPropagation();
            cleanup();
        });
}
const allFilter = document.getElementById("allFilter");
const activeFilter = document.getElementById("activeFilter");
const completedFilter = document.getElementById("completedFilter");
function setActiveFilter(activeButton){
    const buttons = document.querySelectorAll(".filter-buttons button");
    buttons.forEach(function(button){
        button.classList.remove("active-filter")
    });
    activeButton.classList.add("active-filter");
}
function filterTasks(type){
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(function(task){
        const isCompleted = task.classList.contains("completed");
        if(type === "all"){
            task.style.display = "flex";
        }
        else if(type === "active"){
             task.style.display = isCompleted ? "none" : "flex";
        }
        else if(type === "completed"){
             task.style.display = isCompleted ? "flex" : "none";
        }
    });
}
allFilter.addEventListener("click",function(){
    filterTasks("all");
    setActiveFilter(allFilter);
});
activeFilter.addEventListener("click",function(){
    filterTasks("active");
    setActiveFilter(activeFilter);
});
completedFilter.addEventListener("click",function(){
    filterTasks("completed");
    setActiveFilter(completedFilter);
});
setActiveFilter(allFilter);
searchTask.addEventListener("input", function(){

    const searchText = searchTask.value.toLowerCase();

    const tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(function(task){

        const taskName = task.querySelector(".task-text").textContent.toLowerCase();

        if(taskName.includes(searchText)){

            task.style.display = "flex";
        }
        else{

            task.style.display = "none";
        }
    });
});
sortTasks.addEventListener("change", function(){
    const tasks = Array.from(document.querySelectorAll("#taskList li"));
    if(sortTasks.value === "high"){
       tasks.sort(function(a,b){
       const priorityOrder = {
             High:3,
             Medium:2,
             Low:1
        };
       const aPriority = a.querySelector(".priority-tag").textContent;
       const bPriority = b.querySelector(".priority-tag").textContent;
          return priorityOrder[bPriority] - priorityOrder[aPriority];
        });
    }
    else if(sortTasks.value === "dueDate"){
        tasks.sort(function(a,b){
        const aDate = a.querySelector(".due-date").textContent.replace("Due: ","");
        const bDate = b.querySelector(".due-date").textContent.replace("Due: ","");
          return new Date(aDate) - new Date(bDate);
        });
    }
    tasks.forEach(function(task){
        taskList.appendChild(task);
    });
});

const dashboardNav = document.getElementById("dashboardNav");
const attendanceNav = document.getElementById("attendanceNav");
const tasksNav = document.getElementById("tasksNav");
const timetableNav = document.getElementById("timetableNav");
const settingsNav = document.getElementById("settingsNav");

const dashboardSection = document.getElementById("dashboardSection");
const tasksSection = document.getElementById("tasksSection");
const attendanceSection = document.getElementById("attendanceSection");
const timetableSection = document.getElementById("timetableSection");
const settingsSection = document.getElementById("settingsSection");

function hideAllSections(){

    dashboardSection.style.display = "none";
    tasksSection.style.display = "none";
    attendanceSection.style.display = "none";
    timetableSection.style.display = "none";
    settingsSection.style.display = "none";
}

dashboardNav.addEventListener("click", function(){

    hideAllSections();

    dashboardSection.style.display = "block";
    tasksSection.style.display = "block";
});

attendanceNav.addEventListener("click", function(){

    hideAllSections();

    attendanceSection.style.display = "block";
});

tasksNav.addEventListener("click", function(){

    hideAllSections();

    tasksSection.style.display = "block";
});

timetableNav.addEventListener("click", function(){

    hideAllSections();

    timetableSection.style.display = "block";
});

settingsNav.addEventListener("click", function(){

    hideAllSections();

    settingsSection.style.display = "block";
});

