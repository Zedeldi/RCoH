# RCoH

[![GitHub license](https://img.shields.io/github/license/Zedeldi/RCoH?style=flat-square)](https://github.com/Zedeldi/RCoH/blob/master/LICENSE) [![GitHub last commit](https://img.shields.io/github/last-commit/Zedeldi/RCoH?style=flat-square)](https://github.com/Zedeldi/RCoH/commits) [![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg?style=flat-square)](https://github.com/psf/black)

Remote Control over HTTP (RCoH).

## Description

A Flask application to provide endpoints for viewing and controlling the remote host.

`pyautogui` is used for all local operations, e.g. mouse clicks, key-presses and display monitoring.

There are four endpoints:

- `/` - return client web page
- `/display` - return current frame (Base64-encoded)
- `/keypress` - press specified key
- `/click` - move mouse and click specified button

Using JavaScript, clicks and key-presses are sent to the relevant endpoints with the required data.
The current frame (screenshot) is downloaded every `1000/FPS` milliseconds, formatted as `IMAGE_FORMAT` and Base64-encoded.
If disconnected from the server, remote control will resume after reconnecting.

### Use Cases

RCoH is useful where the client only has a web browser available and temporary remote access is required for a host.
The server will control the active session of the user who has started it.

The host must be accessible to the client, in order to connect to the web server, whether by being connected to the same LAN or by port forwarding.

However, please note that all traffic is unencrypted, meaning the display, mouse clicks and keystrokes are openly visible.
If deploying in a public setting, either a reverse proxy - such as [nginx](https://nginx.org/) - with HTTPS should be used, or the Flask application should listen on `localhost` and port forward via SSH, encrypting traffic along the way.

### Limitations

If other remote desktop protocols, such as RDP or VNC, are unavailable, RCoH should be sufficient for troubleshooting, but lacks various features to be suitable for a robust remote desktop environment.

- Currently, mouse movements are not sent to the server - only clicks.
  - In the same way, mouse dragging will not work either.
- Keys are pressed instantaneously. Therefore, keyboard shortcuts will not work yet.
- Sound is not sent at all - and likely never will be.

## Installation

1. Clone: `git clone https://github.com/Zedeldi/RCoH.git`
2. Install dependencies: `pip3 install -r requirements.txt`
3. Run: `python3 -m rcoh [host] [port]`

Libraries:

- [Flask](https://pypi.org/project/Flask/) - web application
- [PyAutoGUI](https://pypi.org/project/PyAutoGUI/) - GUI automation

## License

`RCoH` is licensed under the [MIT Licence](https://mit-license.org/) for everyone to use, modify and share freely.

This project is distributed in the hope that it will be useful, but without any warranty.

## Credits

Icons = <https://feathericons.com/>

## Donate

If you found this project useful, please consider donating. Any amount is greatly appreciated! Thank you :smiley:

[![PayPal](https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-150px.png)](https://paypal.me/ZackDidcott)
