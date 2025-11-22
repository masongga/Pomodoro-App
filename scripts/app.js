// Links to HTML
const setTimerBtn = document.getElementById("timerButton");
const studyTime = document.getElementById("studyTime");
const breakTime = document.getElementById("breakTime");
const outputTimer = document.getElementById("outputTimer");
const cyclesSelect = document.getElementById("cyclesSelect");
const cycleTimer = document.getElementById("cycleTimer");
const studyAlarmSound = document.getElementById("studyAlarmSound");
const breakAlarmSound = document.getElementById("breakAlarmSound");

// variables used throughout
let timer;
let intervalId;
let currentCycle = 0;
let totalCycles;
let displayCycles = 0;
let isStudyTime = true;

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
      studyAudio.play();
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
async function handleTimerComplete() {
  if (isStudyTime) {
    // if studying
    breakAudio.play();
    isStudyTime = false;
    currentCycle++;
    setTimeout(startTimer, 1000);
    updateDisplay();
  } else {
    // if on a break
    studyAudio.play();
    isStudyTime = true;
    setTimeout(startTimer, 1000);
    displayCycles--;
    updateDisplay();
  }
}

// changes visuals based on study or break
function showState() {
  if (!isStudyTime) {
    cycleTimer.style.backgroundColor = "rgba(255, 123, 255, 1)";
    outputTimer.style.backgroundColor = "rgba(255, 123, 255, 1)";
  } else {
    cycleTimer.style.backgroundColor = "rgb(221, 221, 70)";
    outputTimer.style.backgroundColor = "rgb(221, 221, 70)";
  }
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = false;
}
