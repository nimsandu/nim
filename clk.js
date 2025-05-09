const digitPatterns = [
  // 0
  [1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0],
  // 1
  [0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0],
  // 2
  [1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0],
  // 3
  [1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0],
  // 4
  [1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
  // 5
  [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0],
  // 6
  [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0],
  // 7
  [1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
  // 8
  [1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0],
  // 9
  [1,1,1,1,1,1,0,0,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,0,0,0]
];

function createClockDisplay() {
  const clockElement = document.getElementById("clock");
  clockElement.innerHTML = "";

  // Hours container
  const hoursContainer = document.createElement("div");
  hoursContainer.className = "hours";
  hoursContainer.style.display = "flex";

  // Hour digits
  const hourDigit1 = document.createElement("div");
  hourDigit1.className = "digit hour-digit-1";
  
  const hourDigit2 = document.createElement("div");
  hourDigit2.className = "digit hour-digit-2";

  // Create dots for hour digits
  for (let i = 0; i < 49; i++) {
    const dot1 = document.createElement("div");
    dot1.className = "dot";
    hourDigit1.appendChild(dot1);
    
    const dot2 = document.createElement("div");
    dot2.className = "dot";
    hourDigit2.appendChild(dot2);
  }

  hoursContainer.appendChild(hourDigit1);
  hoursContainer.appendChild(hourDigit2);

  // Separator
  const separator = document.createElement("div");
  separator.className = "separator";
  
  const separatorDot1 = document.createElement("div");
  separatorDot1.className = "separator-dot";
  
  const separatorDot2 = document.createElement("div");
  separatorDot2.className = "separator-dot";
  
  separator.appendChild(separatorDot1);
  separator.appendChild(separatorDot2);

  // Minutes container
  const minutesContainer = document.createElement("div");
  minutesContainer.className = "minutes";
  minutesContainer.style.display = "flex";
  
  const minuteDigit1 = document.createElement("div");
  minuteDigit1.className = "digit minute-digit-1";
  
  const minuteDigit2 = document.createElement("div");
  minuteDigit2.className = "digit minute-digit-2";

  // Create dots for minute digits
  for (let i = 0; i < 49; i++) {
    const dot1 = document.createElement("div");
    dot1.className = "dot";
    minuteDigit1.appendChild(dot1);
    
    const dot2 = document.createElement("div");
    dot2.className = "dot";
    minuteDigit2.appendChild(dot2);
  }

  minutesContainer.appendChild(minuteDigit1);
  minutesContainer.appendChild(minuteDigit2);

  // Add all elements to the clock
  clockElement.appendChild(hoursContainer);
  clockElement.appendChild(separator);
  clockElement.appendChild(minutesContainer);
}

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  
  const digits = [
    parseInt(hours[0]),
    parseInt(hours[1]),
    parseInt(minutes[0]),
    parseInt(minutes[1])
  ];

  for (let i = 0; i < 4; i++) {
    const value = digits[i];
    const pattern = digitPatterns[value];
    const selector = i === 0 ? ".hour-digit-1" : 
                    i === 1 ? ".hour-digit-2" : 
                    i === 2 ? ".minute-digit-1" : ".minute-digit-2";
    
    const dots = document.querySelector(selector).querySelectorAll(".dot");
    
    // Clear all dots first
    dots.forEach(dot => dot.classList.remove("active"));
    
    // Activate dots according to pattern
    for (let j = 0; j < pattern.length; j++) {
      if (pattern[j]) {
        dots[j].classList.add("active");
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  createClockDisplay();
  updateClock();
  
  const now = new Date();
  // Update clock every minute at the exact minute change
  setTimeout(() => {
    updateClock();
    setInterval(updateClock, 60000);
  }, (60 - now.getSeconds()) * 1000);
});

document.getElementById("toggle-bg").addEventListener("click", () => {
  document.body.classList.toggle("bg-gif");
});

const toggleFullscreen = document.getElementById("toggle-fullscreen");
toggleFullscreen.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
});

let totalPages = 0, currentPage = 0, timePerPage = 0;
let timeLeft = 0, timerInterval;
let totalSecondsElapsed = 0, totalPausedSeconds = 0;
let isPaused = false, pauseStartTime = 0;
let isTimerActive = false;

function openTimerPopup() {
  document.getElementById("timer-popup").classList.add("visible");
  document.getElementById("overlay").classList.add("visible");
}

function closeTimerPopup() {
  document.getElementById("timer-popup").classList.remove("visible");
  document.getElementById("overlay").classList.remove("visible");
}

function createPageIndicators() {
  if (isTimerActive) {
    // Page progress bar
    const progressBar = document.getElementById("progress-bar-bottom");
    if (!progressBar) return;
    
    const pagesProgress = ((currentPage - 1) / totalPages) * 100;
    const currentPageProgress = (1 - (timeLeft / timePerPage)) * (100 / totalPages);
    const totalProgress = pagesProgress + currentPageProgress;
    
    progressBar.style.width = `${totalProgress}%`;
    
    // Total progress bar (new)
    const totalProgressBar = document.getElementById("total-progress-bar");
    if (totalProgressBar) {
      const totalSessionTime = totalPages * timePerPage;
      const totalTimeElapsed = (currentPage - 1) * timePerPage + (timePerPage - timeLeft);
      const totalProgressPercentage = (totalTimeElapsed / totalSessionTime) * 100;
      totalProgressBar.style.width = `${totalProgressPercentage}%`;
    }
  }
}

document.getElementById("open-timer").addEventListener("click", openTimerPopup);
document.getElementById("close-popup").addEventListener("click", closeTimerPopup);
document.getElementById("start-timer-btn").addEventListener("click", startTimer);
document.getElementById("pauseBtnMini").addEventListener("click", pauseTimer);
document.getElementById("resumeBtnMini").addEventListener("click", resumeTimer);
document.getElementById("nextPageBtnMini").addEventListener("click", skipToNextPage);
document.getElementById("endSessionBtnMini").addEventListener("click", endSession);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  const pagesInput = document.getElementById("totalPages");
  const minutesInput = document.getElementById("minutesPerPage");
  
  if (!pagesInput || !minutesInput) return;
  
  totalPages = parseInt(pagesInput.value);
  const minsPerPage = parseFloat(minutesInput.value);
  
  if (isNaN(totalPages) || isNaN(minsPerPage) || totalPages <= 0 || minsPerPage <= 0) {
    alert("Please enter valid numbers greater than 0");
    return;
  }
  
  timePerPage = Math.round(minsPerPage * 60);
  currentPage = 1;
  totalSecondsElapsed = 0;
  totalPausedSeconds = 0;
  isPaused = false;
  isTimerActive = true;
  
  closeTimerPopup();
  document.getElementById("timer-controls-bottom").classList.add("visible");
  
  timeLeft = timePerPage;
  document.getElementById("status-text-bottom").textContent = `Page ${currentPage}/${totalPages} - ${formatTime(timeLeft)}`;
  
  createPageIndicators();
  startCountdown();
}

function startCountdown() {
  timerInterval = setInterval(() => {
    if (isPaused) return;
    
    if (timeLeft > 0) {
      timeLeft--;
      totalSecondsElapsed++;
      document.getElementById("status-text-bottom").textContent = `Page ${currentPage}/${totalPages} - ${formatTime(timeLeft)}`;
      createPageIndicators();
    } else {
      clearInterval(timerInterval);
      
      if (currentPage < totalPages) {
        currentPage++;
        timeLeft = timePerPage;
        document.getElementById("status-text-bottom").textContent = `Page ${currentPage}/${totalPages} - ${formatTime(timeLeft)}`;
        createPageIndicators();
        startCountdown();
      } else {
        document.getElementById("status-text-bottom").textContent = "Session Complete!";
      }
    }
  }, 1000);
}

function pauseTimer() {
  if (!isPaused) {
    isPaused = true;
    pauseStartTime = new Date().getTime();
    document.getElementById("pauseBtnMini").style.display = "none";
    document.getElementById("resumeBtnMini").style.display = "inline-flex";
  }
}

function resumeTimer() {
  if (isPaused) {
    isPaused = false;
    const pauseDuration = (new Date().getTime() - pauseStartTime) / 1000;
    totalPausedSeconds += pauseDuration;
    document.getElementById("pauseBtnMini").style.display = "inline-flex";
    document.getElementById("resumeBtnMini").style.display = "none";
  }
}

function skipToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    timeLeft = timePerPage;
    document.getElementById("status-text-bottom").textContent = `Page ${currentPage}/${totalPages} - ${formatTime(timeLeft)}`;
    createPageIndicators();
    
    if (!timerInterval) {
      startCountdown();
    }
  }
}

function endSession() {
  isTimerActive = false;
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("timer-controls-bottom").classList.remove("visible");
  document.getElementById("totalPages").value = "";
  document.getElementById("minutesPerPage").value = "";
  isPaused = false;
  document.getElementById("pauseBtnMini").style.display = "inline-flex";
  document.getElementById("resumeBtnMini").style.display = "none";
}
