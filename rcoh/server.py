"""Flask application to remote control host."""

import base64
import socket
from io import BytesIO

import pyautogui
from flask import Flask, abort, render_template, request, url_for

DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 8080
IMAGE_FORMAT = "JPEG"
KEY_STRIP_PREFIXES = ["arrow"]


app = Flask(__name__)


@app.route("/")
def index() -> str:
    """Return HTML for index."""
    rcserver = {
        "hostname": socket.gethostname(),
        "displayUrl": url_for("display"),
        "imageFormat": IMAGE_FORMAT,
        "keypressUrl": url_for("keypress"),
        "clickUrl": url_for("click"),
    }
    return render_template("index.html", rcserver=rcserver)


@app.route("/display")
def display() -> str:
    """Return Base64-encoded bytes of current frame."""
    try:
        frame = pyautogui.screenshot()
    except pyautogui.PyAutoGUIException:
        import pyscreeze

        frame = pyscreeze.screenshot()

    buff = BytesIO()
    frame.save(buff, format=IMAGE_FORMAT)
    return base64.b64encode(buff.getvalue()).decode()


@app.route("/keypress")
def keypress() -> dict:
    """Type specified keys."""
    key, keycode = (
        request.args.get("key").lower(),
        request.args.get("keyCode", type=int),
    )
    if not key:
        return abort(400)
    for prefix in KEY_STRIP_PREFIXES:
        key = key.removeprefix(prefix)
    pyautogui.press(key)
    return {"key": key, "keyCode": keycode}


@app.route("/click")
def click() -> dict:
    """Click specified at specified co-ordinates."""
    x, y = request.args.get("x", type=int), request.args.get("y", type=int)
    button = request.args.get("button", "left")
    pyautogui.click(x=x, y=y, button=button)
    return {"position": pyautogui.position(), "button": button}


if __name__ == "__main__":
    app.run(DEFAULT_HOST, DEFAULT_PORT)
