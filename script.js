const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    addTask("todo-list", text);
    taskInput.value = "";
    saveAllTasks();
    updateProgress();

  }
});

function addTask(listId, text) {
  const taskList = document.getElementById(listId);
  const li = document.createElement("li");
  li.className = "task";
  li.innerHTML = `
    <span>${text}</span>
    <div class="task-buttons">
      <button class="move-btn left-btn">←</button>
      <button class="move-btn right-btn">→</button>
      <button class="move-btn delete-btn">✖</button>
    </div>
  `;

  // Move left
  li.querySelector(".left-btn").onclick = () => {
    if (listId === "progress-list") {
      addTask("todo-list", text);
    } else if (listId === "done-list") {
      addTask("progress-list", text);
    }
    li.remove();
    saveAllTasks();
    updateProgress();
    
  };

  // Move right
  li.querySelector(".right-btn").onclick = () => {
    if (listId === "todo-list") {
      addTask("progress-list", text);
    } else if (listId === "progress-list") {
      addTask("done-list", text);
    }
    li.remove();
    saveAllTasks();
  };

  // Delete
  li.querySelector(".delete-btn").onclick = () => {
    li.remove();
    saveAllTasks();
  };

  taskList.appendChild(li);
}

function saveAllTasks() {
  const data = {
    todo: getTasks("todo-list"),
    progress: getTasks("progress-list"),
    done: getTasks("done-list"),
  };
  localStorage.setItem("tasks", JSON.stringify(data));
}

function getTasks(listId) {
  return Array.from(document.getElementById(listId).children).map(
    (li) => li.querySelector("span").innerText
  );
}

function loadTasks() {
  const data = JSON.parse(localStorage.getItem("tasks"));
  if (!data) return;
  data.todo.forEach((text) => addTask("todo-list", text));
  data.progress.forEach((text) => addTask("progress-list", text));
  data.done.forEach((text) => addTask("done-list", text));
}

window.onload = loadTasks;
// Notes functionality
const notesArea = document.getElementById("notes-area");

// Load saved notes
notesArea.value = localStorage.getItem("notes") || "";

// Save notes on input
notesArea.addEventListener("input", () => {
  localStorage.setItem("notes", notesArea.value);
});
// Daily Planner: Save and Load

const plannerIds = ["morning", "afternoon", "evening"];

plannerIds.forEach((period) => {
  const textarea = document.getElementById(`${period}-text`);
  
  // Load saved
  textarea.value = localStorage.getItem(`${period}-plan`) || "";

  // Save on change
  textarea.addEventListener("input", () => {
    localStorage.setItem(`${period}-plan`, textarea.value);
  });
});
// Pomodoro Timer Logic
let timer;
let timeLeft = 25 * 60; // in seconds
let isRunning = false;
let isWork = true;

const timerDisplay = document.getElementById("timer");
const sessionLabel = document.getElementById("session-label");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        isWork = !isWork;
        timeLeft = isWork ? 25 * 60 : 5 * 60;
        sessionLabel.textContent = isWork ? "Current: Work Session" : "Current: Break Time";
        updateDisplay();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  isWork = true;
  timeLeft = 25 * 60;
  sessionLabel.textContent = "Current: Work Session";
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

updateDisplay();
function updateProgress() {
  const totalTasks =
    getTasks("todo-list").length +
    getTasks("progress-list").length +
    getTasks("done-list").length;

  const completedTasks = getTasks("done-list").length;
  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-text").textContent = 
    `${completedTasks} of ${totalTasks} tasks completed (${percent}%)`;
}
