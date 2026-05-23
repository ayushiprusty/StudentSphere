function saveTasks(){
    const allTasks = [];
    const tasks = document.querySelectorAll("#taskList li");
    tasks.forEach(function(task){
        allTasks.push(task.firstChild.textContent);
    });
    localStorage.setItem("tasks",JSON.stringify(allTasks));
}
const taskInput = document.getElementById("taskInput");
const addTaskbtn = document.getElementById("addTaskbtn");
const taskList = document.getElementById("taskList");
addTaskbtn.addEventListener("click",function(){
    const taskText = taskInput.value;
    const taskMessage = document.getElementById("taskMessage");
    if(taskText.trim() === ""){
        taskMessage.textContent = "Please enter a valid task.";
        return;
    }
    const existingTasks = document.querySelectorAll("#taskList li");
    for(let task of existingTasks){
        if(task.firstChild.textContent === taskText){
            taskMessage.textContent = "Task already exists.";
            return;
        }
    }
    const li = document.createElement("li");
    li.textContent = taskText;
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click",function(){
        li.remove();
        saveTasks();
    })
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    taskMessage.textContent = "";
    saveTasks();
});
window.addEventListener("load",function(){
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    storedTasks.forEach(function(task){
        const li=document.createElement("li");
        li.textContent = task;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click",function(event){
            event.stopPropagation();
            li.remove();
            saveTasks();
        });

    li.addEventListener("click", function(){
        li.classList.toggle("completed");
        saveTasks();
    });
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
});
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click",function(){
    document.body.classList.toggle("light-mode");
});
const progressFill = document.querySelector(".progress-fill");
const attendanceText = document.getElementById("attendanceText");
let attendance = 82;
progressFill.style.width = attendance + "%";
attendanceText.textContent = attendance + "%";