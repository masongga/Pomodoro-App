// Links to HTML
const setTimerBtn = document.getElementById("timerButton");
const studyTime = document.getElementById("studyTime");
const breakTime = document.getElementById("breakTime");
const outputTimer = document.getElementById("outputTimer");
const cyclesSelect = document.getElementById("cyclesSelect");
const cycleTimer = document.getElementById("cycleTimer");

// variables used throughout
let timer;
let intervalId;
let currentCycle = 0;
let totalCycles;
let displayCycles = 0;
let isStudyTime = true;

// button click to start the timer
setTimerBtn.addEventListener("click", startPomodoro);

// function to start the timer
function startPomodoro() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  isStudyTime = true;
  currentCycle = 0;
  totalCycles = parseInt(cyclesSelect.value);
  displayCycles = totalCycles;

  startTimer();
}

// starts the actual timer counting down
function startTimer() {
  if (isStudyTime) {
    timer = parseInt(studyTime.value) * 60; // converts to seconds for studying time
  } else {
    timer = parseInt(breakTime.value) * 60; // gets the time for breaks
  }

  updateDisplay();

  intervalId = setInterval(() => {
    timer--;
    updateDisplay();

    if (timer <= 0 && currentCycle >= totalCycles && isStudyTime == false) {
      stopTimer();
      isStudyTime = true;
      resetDisplay();
    } else if (timer <= 0) {
      clearInterval(intervalId);
      handleTimerComplete();
    }
  }, 1000);
}

// displays and updates (when called) the current time/cycle
function updateDisplay() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  outputTimer.innerText = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  cycleTimer.innerText = displayCycles.toString();
  showState();
}

// resets the display's to 0 and 00:00
function resetDisplay() {
  outputTimer.innerText = "00:00";
  cycleTimer.innerText = "0";
  cycleTimer.style.backgroundColor = "rgb(221, 221, 70)";
  outputTimer.style.backgroundColor = "rgb(221, 221, 70)";
}

// handles what happens when the timer hits 0
function handleTimerComplete() {
  if (isStudyTime) {
    // if studying
    isStudyTime = false;
    currentCycle++;
    setTimeout(startTimer, 1000);
    updateDisplay();
  } else {
    // if on a break
    isStudyTime = true;
    setTimeout(startTimer, 1000);
    displayCycles--;
    updateDisplay();
  }
}

// changes visuals based on study or break
function showState() {
  if (!isStudyTime) {
    cycleTimer.style.backgroundColor = "rgba(240, 134, 12, 1)";
    outputTimer.style.backgroundColor = "rgba(240, 134, 12, 1)";
  } else {
    cycleTimer.style.backgroundColor = "rgb(221, 221, 70)";
    outputTimer.style.backgroundColor = "rgb(221, 221, 70)";
  }
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = false;
}
