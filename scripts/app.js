const {
  setInterval: nodeSetInterval,
  clearInterval: nodeClearInterval,
} = require("timers");

// Links to HTML
const setTimerBtn = document.getElementById("timerButton");
const studyTime = document.getElementById("studyTime");
const breakTime = document.getElementById("breakTime");
const outputTimer = document.getElementById("outputTimer");
const cyclesSelect = document.getElementById("cyclesSelect");
const cycleTimer = document.getElementById("cycleTimer");
const studyAlarmSound = document.getElementById("studyAlarmSound");
const breakAlarmSound = document.getElementById("breakAlarmSound");
const timerModal = document.getElementById("modal");
const formModal = document.getElementById("second-modal");
const header = document.getElementById("title");
const pauseButton = document.getElementById("pauseButton");
const stopButton = document.getElementById("stopButton");

// variables used throughout
let timer;
let intervalId;
let currentCycle = 0;
let totalCycles;
let displayCycles = 0;
let isStudyTime = true;
let isPaused = false;
let remainingTime = 0;

// array of objects of each sound file
let timerSounds = [
  { name: "Bunny Hopping", path: "../Audio/TimerEnd/bunny_hopping.mp3" },
  { name: "Great Song", path: "../Audio/TimerEnd/great_song.mp3" },
  { name: "Hippo Dance", path: "../Audio/TimerEnd/hippo_dance.mp3" },
  { name: "Llora Llora", path: "../Audio/TimerEnd/llora_llora.mp3" },
  { name: "Last Christmas", path: "../Audio/TimerEnd/last_christmas.mp3" },
  { name: "Carol of the Bells", path: "../Audio/TimerEnd/carolOfTheBells.mp3" },
  { name: "Calm", path: "../Audio/TimerEnd/endStudy.mp3" },
  { name: "Bounce", path: "../Audio/TimerEnd/endBreak.mp3" },
  { name: "ringtone", path: "../Audio/TimerEnd/longer alarm.mp3" },
  { name: "Wakey Wakey", path: "../Audio/TimerEnd/wakey_wakey.mp3" },
  {
    name: "My Massive Weiner",
    path: "../Audio/TimerEnd/my_massive_weiner.mp3",
  },
  {
    name: "I Didn't See Nothing",
    path: "../Audio/TimerEnd/i_didn_t_see_nothing.mp3",
  },
];

for (let sound of timerSounds) {
  studyAlarmSound.add(new Option(sound.name, sound.path));
}

for (let sound of timerSounds) {
  breakAlarmSound.add(new Option(sound.name, sound.path));
}

let studyAudio = new Audio(timerSounds[0].path);
let breakAudio = new Audio(timerSounds[0].path);
studyAudio.volume = 0.2;
breakAudio.volume = 0.2;

// listen for changes in drop downs and set the sound value
studyAlarmSound.addEventListener("change", () => {
  studyAudio.src = studyAlarmSound.value;
});

breakAlarmSound.addEventListener("change", () => {
  breakAudio.src = breakAlarmSound.value;
});

// button click to start the timer
setTimerBtn.addEventListener("click", startPomodoro);

// pause button
pauseButton.addEventListener("click", pauseTimer);

// stop button
stopButton.addEventListener("click", stopTimer);

// function to start the timer
function startPomodoro() {
  //hide the form modal and show the timer
  timerModal.style = "display: block";
  formModal.style = "display: none";

  // change the header text
  header.textContent = "Studying";

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
  const startTime = Date.now();
  let targetDuration;

  if (isPaused && remainingTime > 0) {
    targetDuration = remainingTime * 1000;
    isPaused = false;
    remainingTime = 0;
  } else {
    if (isStudyTime) {
      targetDuration = parseInt(studyTime.value) * 60 * 1000; // converts to seconds for studying time
    } else {
      targetDuration = parseInt(breakTime.value) * 60 * 1000; // gets the time for breaks
    }
  }

  const endTime = startTime + targetDuration;

  intervalId = nodeSetInterval(() => {
    const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    timer = remaining;
    updateDisplay();

    if (timer <= 0 && currentCycle >= totalCycles && isStudyTime == false) {
      breakAudio.play();
      stopTimer();
      // isStudyTime = true;
      // resetDisplay();

      // //hide the form modal and show the timer
      // timerModal.style = "display: none";
      // formModal.style = "display: show";
      // header.textContent = "Pomodoro Study App";
    } else if (timer <= 0) {
      nodeClearInterval(intervalId);
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
async function handleTimerComplete() {
  if (isStudyTime) {
    // if studying
    studyAudio.play();
    isStudyTime = false;
    currentCycle++;
    updateDisplay();
    startTimer();
  } else {
    // if on a break
    breakAudio.play();
    isStudyTime = true;
    displayCycles--;
    updateDisplay();
    startTimer();
  }
}

// changes visuals based on study or break
function showState() {
  if (!isStudyTime) {
    cycleTimer.style.backgroundColor = "rgba(255, 123, 255, 1)";
    outputTimer.style.backgroundColor = "rgba(255, 123, 255, 1)";
    header.textContent = "Take a Break";
  } else {
    cycleTimer.style.backgroundColor = "rgb(221, 221, 70)";
    outputTimer.style.backgroundColor = "rgb(221, 221, 70)";
    header.textContent = "Studying";
  }
}

function stopTimer() {
  nodeClearInterval(intervalId);
  intervalId = false;
  isStudyTime = true;
  isPaused = false;
  remainingTime = 0;
  pauseButton.textContent = "Pause";
  resetDisplay();

  //hide the form modal and show the timer
  timerModal.style = "display: none";
  formModal.style = "display: block";
  header.textContent = "Pomodoro Study App";
}

function pauseTimer() {
  if (intervalId && !isPaused) {
    nodeClearInterval(intervalId);
    remainingTime = timer;
    isPaused = true;
    pauseButton.textContent = "Resume";
  } else if (isPaused) {
    pauseButton.textContent = "Pause";
    startTimer();
  }
}
