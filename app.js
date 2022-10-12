/*
* https://frontendeval.com/questions/countdown-timer
*
* Create a countdown timer that notifies the user
*/
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const pauseBtn = document.getElementById('pause');
const inputs = document.querySelectorAll('input');
const labels = document.querySelectorAll('label');
const displays = document.querySelectorAll('.display');
const formControls = document.querySelectorAll('.form-control');
const displayCtnrs = document.querySelectorAll('.display-ctnr');
const timesUpCtnr = document.getElementById('times-up');
let endTime;
let timerStop = 0;
let start = false;
let granted = false;

// DOM Functions
inputs.forEach((input, i) => {
  input.addEventListener('focus', e => {
    checkNotificationPermission();
    hideLabel(e.target, i)
  })
  input.addEventListener('blur', e => showLabel(e.target, i))
})

function hideLabel(input, idx) {
  if(input === document.activeElement || input.value !== '') labels[idx].style.display = 'none'; 
}
function showLabel(input, idx) {
  if(input.value === '') labels[idx].style.display = 'block';
}

function clearInputs() {
  inputs.forEach(input => input.value = '')
}

// Countdown Functions
function startCountdown() {
  const currentDate = new Date();
  
  endTimeHours = currentDate.getHours() + +inputs[0].value
  endTimeMinutes = currentDate.getMinutes() + +inputs[1].value
  endTimeSeconds = currentDate.getSeconds() + +inputs[2].value
  
  endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), endTimeHours, endTimeMinutes, endTimeSeconds).getTime();
  
  start = true;
}

function updateCountdown() {
  const currentDate = new Date();
  let diff = endTime - currentDate.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;
  let hours = Math.floor(diff / oneHour)
  let minutes = Math.floor((diff % oneHour) / oneMinute)
  let seconds = Math.floor((diff % oneMinute) / 1000)
  timerStop = diff;

  let values = [hours, minutes, seconds]
  displays.forEach((el, i) => {
    if(timerStop < 0) el.textContent = '00';
    if(timerStop > 0) el.textContent = values[i] < 10 ? '0' + `${values[i]}` : `${values[i]}`;
  })
  

  if(timerStop <= 0) {
    callNotification()
    timesUpCtnr.classList.remove('hide')
  }
  
}

// Update Elements on Start
function updateElements() {
  displayCtnrs.forEach(el => el.classList.remove('hide'))
  formControls.forEach(el => el.classList.add('hide'))
  startBtn.classList.add('hide')
  pauseBtn.classList.remove('hide')
  resetBtn.classList.remove('hide')
}

// Start Timer
startBtn.addEventListener('click', () => {
  inputs.forEach(input => {
    if(input.value === '') return;
    startCountdown();
    updateElements();
  })
})

// Pause Timer
pauseBtn.addEventListener('click', () => {
  start = !start;
  pauseBtn.innerText = 'Resume'
  // if(!start) {
  //   // pauseBtn.style.backgroundColor = '#21aa1d'
  // }
  if(start) {
    pauseBtn.innerText = 'Pause';
    // pauseBtn.style.backgroundColor = '#e9c63b'
  }
})

// Reset
resetBtn.addEventListener('click', () => {
  endTime = undefined
  inputs.forEach((input, idx) => {
    clearInputs();
    showLabel(input, idx)
    formControls[idx].classList.remove('hide')
    displays[idx].innerText = ''
    displayCtnrs[idx].classList.add('hide')
    pauseBtn.classList.add('hide')
    resetBtn.classList.add('hide')
    startBtn.classList.remove('hide')
  })
  timesUpCtnr.classList.add('hide')
  start = false;
})

setInterval(() => {
  if((start && timerStop >= 0)) updateCountdown()
}, 1000)

// Notification Functions
Notification.requestPermission().then(res => {
  console.log(res);
});

const checkNotificationPermission = () => {
  if(Notification.permission === 'granted') {
    granted = true;
    hideError();
  }
  
  if(!granted) showError();
}

const callNotification = () => {
  const showNotification = () => {
    new Notification('Time\'s Up!', {
      body: 'Click to dismiss',
    });    
  };
  showNotification();
};

const showError = () => {
  const error = document.querySelector('.error');
  error.style.display = 'block';
  error.textContent = 'Notifications are blocked';
}

const hideError = () =>  {
  const error = document.querySelector('.error');
  error.style.display = 'none'
  error.textContent = '';
}

// On Page Unload
// window.addEventListener('beforeunload', e => {
//   const confirmationMessage = "U Wot M8??"
//   clearInputs();
//   (e || window.event).returnValue = confirmationMessage;
//   return confirmationMessage;
// })