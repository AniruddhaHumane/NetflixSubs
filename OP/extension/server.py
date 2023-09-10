import http.server
import socketserver

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSHTTPRequestHandler, self).end_headers()

Handler = CORSHTTPRequestHandler
with socketserver.TCPServer(("", 19191), Handler) as httpd:
    print("Server running on port 19191")
    httpd.serve_forever()
