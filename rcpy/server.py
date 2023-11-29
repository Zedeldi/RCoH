"""Flask application to remote control host."""

import base64
import socket
from io import BytesIO

import pyautogui
from flask import Flask, abort, render_template, request, url_for

IMAGE_FORMAT = "JPEG"


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
    key, keycode = request.args.get("key"), request.args.get("keyCode")
    if not key:
        return abort(400)
    pyautogui.write(key)
    res = {"key": key, "keyCode": keycode}
    return res


@app.route("/click")
def click() -> dict:
    """Click specified at specified co-ordinates."""
    x, y = request.args.get("x", type=int), request.args.get("y", type=int)
    pyautogui.click(x=x, y=y)
    res = {"position": pyautogui.position()}
    return res


if __name__ == "__main__":
    app.run("0.0.0.0", 8080)
