const hexInput = document.querySelector("#hex-input");
const inputColorBox = document.querySelector("#input-color-box");
const colorCircle = document.querySelector("#input-color-box .color-circle");
const colorText = document.querySelector("#input-color-box .color-text");
const inputColorText = document.querySelector("#input-color-text");
const alteredColorBox = document.querySelector("#altered-color-box");
const alteredColorCircle = document.querySelector(
  "#altered-color-box .color-circle"
);
const alteredColorText = document.querySelector(
  "#altered-color-box .color-text"
);
const slider = document.querySelector("#slider");
const sliderText = document.querySelector("#slider-text");
const lightenText = document.querySelector("#lighten-text");
const darkenText = document.querySelector("#darken-text");
const toggleBtn = document.querySelector("#toggle-btn");

// Function to generate random hex color
function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to set initial random color
function setInitialColor() {
  const randomColor = generateRandomColor();
  hexInput.value = randomColor;
  setBoxColor();
  displaySliderPercentage();
}

// Call setInitialColor when the page loads
document.addEventListener('DOMContentLoaded', setInitialColor);

// Add touch event support for mobile devices
toggleBtn.addEventListener("touchstart", handleToggle);
toggleBtn.addEventListener("click", handleToggle);

function isValidHex(hex) {
  if (!hex) return false;
  const strippedHex = hex.replace("#", "");
  return strippedHex.length === 3 || strippedHex.length === 6;
}

hexInput.addEventListener("input", setBoxColor);

function setBoxColor() {
  const hex = "#" + hexInput.value;
  if (!isValidHex(hex)) return;
  inputColorBox.style.backgroundColor = hex;
  colorCircle.style.backgroundColor = hex;
  colorText.textContent = hex;
  reset();
}

function convertHexToRGB(hex) {
  if (!isValidHex(hex)) return;
  let strippedHex = hex.replace("#", "");
  strippedHex =
    strippedHex.length === 3
      ? strippedHex
          .split("")
          .map((c) => c + c)
          .join("")
      : strippedHex;
  const r = parseInt(strippedHex.substring(0, 2), 16);
  const g = parseInt(strippedHex.substring(2, 4), 16);
  const b = parseInt(strippedHex.substring(4, 6), 16);
  return { r, g, b };
}

function convertRGBToHex(r, g, b) {
  const firstPair = ("0" + r.toString(16)).slice(-2);
  const secondPair = ("0" + g.toString(16)).slice(-2);
  const thirdPair = ("0" + b.toString(16)).slice(-2);
  return "#" + firstPair + secondPair + thirdPair;
}

function alterColor(hex, percentage) {
  const { r, g, b } = convertHexToRGB(hex);
  const amount = Math.floor((percentage / 100) * 255);
  const isDark = toggleBtn.classList.contains("toggled");
  const getChange = (amount, color, isDark) =>
    Math.floor((amount / 255) * (isDark ? color : 255 - color));
  const newR = increaseWithin0To255(r, getChange(amount, r, isDark));
  const newG = increaseWithin0To255(g, getChange(amount, g, isDark));
  const newB = increaseWithin0To255(b, getChange(amount, b, isDark));
  return convertRGBToHex(newR, newG, newB);
}

function increaseWithin0To255(hex, change) {
  return Math.min(255, Math.max(0, hex + change));
}

slider.addEventListener("input", displaySliderPercentage);
// Add touch event support for mobile devices
slider.addEventListener("touchmove", displaySliderPercentage);

function displaySliderPercentage() {
  if (!isValidHex(hexInput.value)) return;
  sliderText.textContent = slider.value + "%";
  const valueAddition = toggleBtn.classList.contains("toggled")
    ? -slider.value
    : slider.value;
  const alteredHex = alterColor(hexInput.value, valueAddition);
  alteredColorBox.style.backgroundColor = alteredHex;
  alteredColorCircle.style.backgroundColor = alteredHex;
  alteredColorText.textContent = alteredHex;
}

function handleToggle(e) {
  e.preventDefault();
  
  if (toggleBtn.classList.contains("toggled")) {
    toggleBtn.classList.remove("toggled");
    lightenText.classList.remove("unselected");
    darkenText.classList.add("unselected");
  } else {
    toggleBtn.classList.add("toggled");
    lightenText.classList.add("unselected");
    darkenText.classList.remove("unselected");
  }
  
  slider.value = 50;
  sliderText.textContent = "50%";
  
  if (!isValidHex(hexInput.value)) return;
  
  const valueAddition = toggleBtn.classList.contains("toggled") ? -50 : 50;
  const alteredHex = alterColor(hexInput.value, valueAddition);
  alteredColorBox.style.backgroundColor = alteredHex;
  alteredColorCircle.style.backgroundColor = alteredHex;
  alteredColorText.textContent = alteredHex;
}

function reset() {
  let strippedHex = "#" + hexInput.value;
  alteredColorBox.style.backgroundColor = strippedHex;
  alteredColorCircle.style.backgroundColor = strippedHex;
  alteredColorText.textContent = strippedHex;
}

// Add resize observer to handle layout changes
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    if (entry.target === document.querySelector('.wrapper')) {
      // Recalculate and adjust layout if needed
      const wrapper = entry.target;
      const titleContainer = wrapper.querySelector('.title-container');
      const container = wrapper.querySelector('.container');
      
      if (window.innerWidth <= 768) {
        titleContainer.style.minHeight = 'auto';
        container.style.minHeight = 'auto';
      } else {
        titleContainer.style.minHeight = '80vh';
        container.style.minHeight = '80vh';
      }
    }
  }
});

// Observe the wrapper element
resizeObserver.observe(document.querySelector('.wrapper'));
