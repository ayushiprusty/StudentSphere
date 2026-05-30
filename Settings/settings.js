const usernameInput =
document.getElementById("usernameInput");

const saveSettingsBtn =
document.getElementById("saveSettingsBtn");

const profileImageInput =
document.getElementById("profileImageInput");

const profilePreview =
document.getElementById("profilePreview");

window.addEventListener("load",function(){

    const savedName =
    localStorage.getItem("studentName");

    const savedImage =
    localStorage.getItem("profileImage");

    if(savedName){
        usernameInput.value = savedName;
    }

    if(savedImage){
        profilePreview.src = savedImage;
    }

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const attendance = localStorage.getItem("overallAttendance") || 0;

    document.getElementById("taskStats").textContent =
    "Total Tasks Saved: " + tasks.length;

    document.getElementById("attendanceStats").textContent =
    "Overall Attendance: " + attendance + "%";
});

profileImageInput.addEventListener("change",function(){

    const file =
    profileImageInput.files[0];

    if(!file){
        return;
    }

    const reader = new FileReader();

    reader.onload = function(){

        profilePreview.src = reader.result;

        localStorage.setItem(
            "profileImage",
            reader.result
        );
    };

    reader.readAsDataURL(file);
});

const settingsMessage =
document.getElementById("settingsMessage");

saveSettingsBtn.addEventListener("click",function(){

    localStorage.setItem(
        "studentName",
        usernameInput.value
    );

    settingsMessage.textContent =
    "Settings saved successfully!";

    settingsMessage.style.opacity = "1";

    setTimeout(function(){

        settingsMessage.style.opacity = "0";

    },2000);

});

const resetDataBtn = document.getElementById("resetDataBtn");

resetDataBtn.addEventListener("click", function(){

    const confirmReset = confirm("This will delete all tasks, attendance and settings. Continue?");

    if(confirmReset){

        localStorage.clear();

        alert("All data reset!");

        location.reload();
    }
});