import http.server
import socketserver
import os

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        return super(CORSHTTPRequestHandler, self).end_headers()

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSHTTPRequestHandler, self).end_headers()

Handler = CORSHTTPRequestHandler
with socketserver.TCPServer(("", 19191), Handler) as httpd:
    # change working directory
    os.chdir('__PUT__SUBTITLE__PATH__HERE__')
    print("Server running on port 19191")
    httpd.serve_forever()
