"use strict";

const DEFAULT_FPS = 4;

const display = document.getElementById("display");
const status = document.getElementById("status");
const pause = document.getElementById("pause");
const fps = document.getElementById("fps");

const searchParams = new URLSearchParams(window.location.search);
let displayFps = searchParams.get("fps") || DEFAULT_FPS;
if (displayFps < Number(fps.min) || displayFps > Number(fps.max)) {
    displayFps = DEFAULT_FPS;
}
fps.value = displayFps;

let displayId = null;

function updateFrame() {
    fetch(rcserver.displayUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then((frame) => {
            display.src = `data:image/${rcserver.imageFormat.toLowerCase()};base64,` + frame;
            setStatus();
        })
        .catch((error) => {
            setStatus(error);
        });
}

function setStatus(error = null) {
    let statusText = [`Remote controlling: ${rcserver.hostname}`];
    if (error) {
        display.classList.add("grayscale");
        pause.style.visibility = "visible";
        pause.style.opacity = 1;
        statusText.push("Status: paused", error);
    } else {
        display.classList.remove("grayscale");
        pause.style.visibility = "hidden";
        pause.style.opacity = 0;
        statusText.push(
            "Status: running",
            `Image format: ${rcserver.imageFormat}`,
            `FPS: ${displayFps}`
        );
    }
    status.textContent = statusText.join(" | ");
}

function startDisplay() {
    if (displayId) {
        clearInterval(displayId);
    }
    displayId = setInterval(updateFrame, 1000 / displayFps);
}

function keypress(key, keyCode) {
    fetch(rcserver.keypressUrl + "?" + new URLSearchParams({
        key: key,
        keyCode: keyCode
    }));
}

function click(x, y, button = "left") {
    fetch(rcserver.clickUrl + "?" + new URLSearchParams({
        x: x,
        y: y,
        button: button
    }));
}

function getRelativeXY(clientX, clientY, target) {
    const rect = target.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return [x, y];
}

document.addEventListener("keydown", function(event) {
    keypress(event.key, event.keyCode);
    event.preventDefault();
});

display.onclick = function(event) {
    const [x, y] = getRelativeXY(event.clientX, event.clientY, event.target);
    click(x, y);
    event.preventDefault();
};

display.oncontextmenu = function(event) {
    const [x, y] = getRelativeXY(event.clientX, event.clientY, event.target);
    click(x, y, "right");
    event.preventDefault();
};

fps.onchange = function(event) {
    displayFps = this.value;
    startDisplay();
};

startDisplay();
