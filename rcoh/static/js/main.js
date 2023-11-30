"use strict";

const DEFAULT_FPS = 4;

const display = document.getElementById("display");
const status = document.getElementById("status");
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
            status.textContent = `\
                Remote controlling: ${rcserver.hostname} \
                | Image format: ${rcserver.imageFormat} \
                | FPS: ${displayFps}`;
        })
        .catch((error) => {
            status.textContent = `Could not fetch frame: ${error}`;
        });
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
