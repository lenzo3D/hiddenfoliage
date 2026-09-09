#!/usr/bin/env python3
"""Serve the static Pages export (`out/`) at http://localhost:3001/hiddenfoliage/.

For previewing the last `PAGES=1 next build` without Node installed. The
export is built with basePath /hiddenfoliage, so the prefix is stripped here
the way GitHub Pages does. Usage: python3 scripts/serve-static.py [port]
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "out")
PREFIX = "/hiddenfoliage"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3001


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        if self.path in ("", "/"):
            self.send_response(302)
            self.send_header("Location", PREFIX + "/")
            self.end_headers()
            return
        if self.path == PREFIX:
            self.send_response(302)
            self.send_header("Location", PREFIX + "/")
            self.end_headers()
            return
        if self.path.startswith(PREFIX + "/"):
            self.path = self.path[len(PREFIX):]
        super().do_GET()

    def do_HEAD(self):
        if self.path.startswith(PREFIX + "/"):
            self.path = self.path[len(PREFIX):]
        super().do_HEAD()

    def log_message(self, fmt, *args):
        pass


if __name__ == "__main__":
    if not os.path.isdir(ROOT):
        sys.exit("No out/ folder. Run `PAGES=1 npm run build` first.")
    print(f"Serving {os.path.abspath(ROOT)} at http://localhost:{PORT}{PREFIX}/")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
