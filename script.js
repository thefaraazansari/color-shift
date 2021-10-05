const hexInput = document.querySelector("#hex-input");
const inputColorBox = document.querySelector("#input-color-box");
const inputColorText = document.querySelector("#input-color-text");
const alteredColorBox = document.querySelector("#altered-color-box");
const alteredColorText = document.querySelector("#altered-color-text");
const slider = document.querySelector("#slider");
const sliderText = document.querySelector("#slider-text");
const lightenText = document.querySelector("#lighten-text");
const darkenText = document.querySelector("#darken-text");
const toggleBtn = document.querySelector("#toggle-btn");

function isValidHex(hex) {
    if (!hex) return false;
    const strippedHex = hex.replace("#", "");
    return strippedHex.length === 3 || strippedHex.length === 6;
}

hexInput.addEventListener("keyup", setBoxColor);
function setBoxColor() {
    const hex = hexInput.value;
    if (!isValidHex(hex)) return;
    const strippedHex = hex.replace("#", "");
    inputColorBox.style.backgroundColor = "#" + strippedHex;
    inputColorText.textContent = "Input Color #" + strippedHex;
    reset();
}

function convertHexToRGB(hex) {
    if (!isValidHex(hex)) return;
    let strippedHex = hex.replace("#", "");
    if (strippedHex.length === 3) {
        strippedHex = strippedHex[0] + strippedHex[0] + strippedHex[1] + strippedHex[1] + strippedHex[2] + strippedHex[2];
    }
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
    const getChange = (amount, color, isDark) => Math.floor(amount / 255 * (isDark ? color : 255 - color));
    const newR = increaseWithin0To255(r, getChange(amount, r, isDark));
    const newG = increaseWithin0To255(g, getChange(amount, g, isDark));
    const newB = increaseWithin0To255(b, getChange(amount, b, isDark));
    return convertRGBToHex(newR, newG, newB);
}

function increaseWithin0To255(hex, change) {
    return Math.min(255, Math.max(0, hex + change));
}

slider.addEventListener("input", displaySliderPercentage);
function displaySliderPercentage() {
    if (!isValidHex(hexInput.value)) return;
    sliderText.textContent = slider.value + "%";
    const valueAddition = toggleBtn.classList.contains("toggled") ? -slider.value : slider.value;
    const alteredHex = alterColor(hexInput.value, valueAddition);
    alteredColorBox.style.backgroundColor = alteredHex;
    alteredColorText.textContent = "Altered Color " + alteredHex;
}

toggleBtn.addEventListener("click", () => {
    if (toggleBtn.classList.contains("toggled")) {
        toggleBtn.classList.remove("toggled");
        lightenText.classList.remove("unselected");
        darkenText.classList.add("unselected");
    } else {
        toggleBtn.classList.add("toggled");
        lightenText.classList.add("unselected");
        darkenText.classList.remove("unselected");
    }
    reset();
});

function reset() {
    slider.value = 0;
    sliderText.textContent = "0%";
    let strippedHex = hexInput.value.replace("#", "");
    alteredColorBox.style.backgroundColor = "#" + strippedHex;
    alteredColorText.textContent = "Altered Color #" + strippedHex;
}