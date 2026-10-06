#!/usr/bin/env python3
"""
ASTRA-LINK Local Development & Demonstration Server
Multi-threaded HTTP server with MIME type resolution for ES Modules.
"""

import http.server
import socketserver
import os
import sys

PORT = 8080

class AstraHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js') or path.endswith('.mjs'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

def run(port=PORT):
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    current_port = port
    for attempt in range(10):
        try:
            httpd = ThreadedHTTPServer(("", current_port), AstraHTTPRequestHandler)
            print(f"==================================================")
            print(f"  ASTRA-LINK Server running at: http://localhost:{current_port}")
            print(f"  Directory: {os.getcwd()}")
            print(f"  Press Ctrl+C to terminate.")
            print(f"==================================================")
            sys.stdout.flush()
            httpd.serve_forever()
            break
        except OSError as e:
            if e.errno == 10048 or "Address already in use" in str(e):
                current_port += 1
            else:
                raise e

if __name__ == '__main__':
    run()
