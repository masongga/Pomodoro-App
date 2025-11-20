const setTimerBtn = document.getElementById("timerButton");
const studyTime = document.getElementById("studyTime");
const breakTime = document.getElementById("breakTime");
const outputTimer = document.getElementById("outputTimer");
const cyclesSelect = document.getElementById("cyclesSelect");
const cycleTimer = document.getElementById("cycleTimer");

let timer;
let intervalId;
let currentCycle = 0;
let totalCycles;
let displayCycles = 0;
let isStudyTime = true;

setTimerBtn.addEventListener("click", startPomodoro);

function startPomodoro() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  currentCycle = 0;
  totalCycles = parseInt(cyclesSelect.value);
  displayCycles = totalCycles;

  startTimer();
}

function startTimer() {
  if (isStudyTime) {
    timer = parseInt(studyTime.value) * 60; // converts to seconds
  } else {
    timer = parseInt(breakTime.value) * 60;
  }

  updateDisplay();

  intervalId = setInterval(() => {
    timer--;
    updateDisplay();

    if (timer <= 0) {
      clearInterval(intervalId);
      handleTimerComplete();
    }
  }, 1000);
}

function updateDisplay() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  outputTimer.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  cycleTimer.innerText = displayCycles.toString();
}

function handleTimerComplete() {
  if (isStudyTime) {
    isStudyTime = false;
    currentCycle++;
    displayCycles--;

    if (currentCycle < totalCycles) {
      setTimeout(startTimer, 1000);
      updateDisplay();
    }
    if (currentCycle == 0) {
      displayCycles = 0;
      updateDisplay();
    }
  } else {
    isStudyTime = true;
    setTimeout(startTimer, 1000);
  }
}
