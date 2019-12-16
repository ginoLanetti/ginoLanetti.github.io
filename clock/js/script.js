const secondArm = document.querySelector(".secondArm");
const minuteArm = document.querySelector(".minuteArm");
const hourArm = document.querySelector(".hourArm");

function setDate() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsDegrees = (seconds / 60) * 360 + 90;
  secondArm.style.transform = `rotate(${secondsDegrees}deg)`;
  const minutes = now.getMinutes();
  const minutesDegrees = (minutes / 60) * 360 + 90;
  minuteArm.style.transform = `rotate(${minutesDegrees}deg)`;
  const hours = now.getHours();
  const hoursDegrees = (hours / 12) * 360 + 90;
  hourArm.style.transform = `rotate(${hoursDegrees}deg)`;

  if (seconds == 0) {
    secondArm.style.transitionDuration = "0s";
  } else {
    secondArm.style.transitionDuration = "0.05s";
  }
  if (minutes == 0) {
    minuteArm.style.transitionDuration = "0s";
  } else {
    minuteArm.style.transitionDuration = "0.05s";
  }
  if (hours == 0) {
    hourArm.style.transitionDuration = "0s";
  } else {
    hourArm.style.transitionDuration = "0.05s";
  }
}

setInterval(setDate, 1000);
