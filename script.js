// Procedures of building the Countdown website.
// 1. Input-form (typing title and date).
// 2. Submit the form (prevent default).
// 3. Replace the html textContent with countdown date. (calculating the time by JS decreasing func).
// 4. Click the reset button to stop the countdown and back to the Input form
// 5. Complete component appears if the countdown stops and reset it again.
// 6. Store data in localStorage to prevent loosing data by reloading the website.

// HTML container
const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdownForm");
const dateEl = document.getElementById("date-picker");

// Countdwon button
const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

// Complete button
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

// Global variables of input value
let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown = "";

// Global variable of seconds, minutes, hours, dates, years (the time that getTime gets is milliseconds = 1/1000 seconds)
let second = 1000;
let minute = second * 60;
let hour = minute * 60;
let day = hour * 24;

// Set Date Input Min with Today's Date
const today = new Date().toISOString().split("T")[0];
dateEl.setAttribute("min", today);

// Second, Populate Countdown / Complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const difference = countdownValue - now;

    const days = Math.floor(difference / day);
    const hours = Math.floor((difference % day) / hour);
    const minutes = Math.floor((difference % hour) / minute);
    const seconds = Math.floor((difference % minute) / second);

    // Hide Input
    inputContainer.hidden = true;

    // If the countdown has ended, show complete
    if (difference < 0) {
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    } else {
      // Else show the countdown in progress
      // Populate Countdown
      // Fill HTML title and elements(span) with values
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// First, Take values from Form Input (Check the event attribute in the developer tool to find out the value)
function updateCountdown(e) {
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;

  // Store the data in localStorage
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  // The func only fires with valid date, otherwise with an alert
  if (countdownDate === "") {
    alert("Please select a date for the countdwon!");
  } else {
    // Get number version of current Date, updateDOM
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Click Reset button to reset all values
function reset() {
  // Hide Countdown, show input form
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // Stop the countdown
  clearInterval(countdownActive);
  // Reset values
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

// Restore previous countdown using local storage (reolading the website does not affect the countdown)
function restorePreviousCountdown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

// On Load, check localStorage
restorePreviousCountdown();
