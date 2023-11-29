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

document.addEventListener("keypress", function(event) {
    fetch(rcserver.keypressUrl + "?" + new URLSearchParams({
        key: event.key,
        keyCode: event.keyCode
    }));
    event.preventDefault();
});

document.getElementById("display").onclick = function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    fetch(rcserver.clickUrl + "?" + new URLSearchParams({
        x: x,
        y: y
    }))
}

setInterval(updateFrame, 1000 / displayFps);
