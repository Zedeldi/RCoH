"""Entry-point to start Flask server."""

import sys

from rcoh.server import DEFAULT_HOST, DEFAULT_PORT, app


def main() -> None:
    """Parse arguments and start Flask server."""
    fn, *args = sys.argv
    host, port = DEFAULT_HOST, DEFAULT_PORT

    if len(args) == 1:
        port = args[0]
    elif len(args) >= 2:
        host, port = args[0], args[1]

    app.run(host, port)


if __name__ == "__main__":
    main()
