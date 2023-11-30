const searchParams = new URLSearchParams(window.location.search)
const displayFps = searchParams.get("fps") || 4

function updateFrame() {
    const display = document.getElementById("display");
    const status = document.getElementById("status");
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

document.addEventListener("keypress", function(event) {
    keypress(event.key, event.keyCode);
    event.preventDefault();
});

document.getElementById("display").onclick = function(event) {
    [x, y] = getRelativeXY(event.clientX, event.clientY, event.target);
    click(x, y);
    event.preventDefault();
}

document.getElementById("display").oncontextmenu = function(event) {
    [x, y] = getRelativeXY(event.clientX, event.clientY, event.target);
    click(x, y, "right");
    event.preventDefault();
}

setInterval(updateFrame, 1000 / displayFps);
