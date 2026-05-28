#!/usr/bin/env python3
"""Local dev server - static files + /api/* via Node (see scripts/invoke-api.js)."""
from __future__ import annotations

import http.server
import json
import os
import socketserver
import subprocess
import urllib.parse

PORT = int(os.environ.get("PORT", "8080"))
ROOT = os.path.dirname(os.path.abspath(__file__))
API_ROUTES = frozenset({"/api/submit-assessment", "/api/get-report"})


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def _do_get_static(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        # Mirror Vercel cleanUrls: /resources → resources.html
        if path and path != "/" and "." not in os.path.basename(path):
            html_file = path.rstrip("/") + ".html"
            if os.path.isfile(os.path.join(ROOT, html_file.lstrip("/"))):
                self.path = html_file + (
                    ("?" + parsed.query) if parsed.query else ""
                )
                return super().do_GET()
        if path.startswith("/blog/") and path not in ("/blog", "/blog.html"):
            slug = path[len("/blog/") :].strip("/")
            if slug and "." not in os.path.basename(slug):
                qs = urllib.parse.parse_qs(parsed.query)
                qs["slug"] = [slug]
                new_query = urllib.parse.urlencode(qs, doseq=True)
                self.path = "/article.html" + ("?" + new_query if new_query else "")
                return super().do_GET()
        if path.startswith("/use-cases/") and path.rstrip("/") != "/use-cases":
            slug = path[len("/use-cases/") :].strip("/")
            if slug and "." not in os.path.basename(slug):
                qs = urllib.parse.parse_qs(parsed.query)
                qs["slug"] = [slug]
                new_query = urllib.parse.urlencode(qs, doseq=True)
                self.path = "/use-case-landing.html" + ("?" + new_query if new_query else "")
                return super().do_GET()
        return super().do_GET()

    def _invoke_api(
        self, api_path: str, method: str, query: str, body: bytes
    ) -> tuple[int, bytes, list[tuple[str, str]]]:
        script = os.path.join(ROOT, "scripts", "invoke-api.js")
        if not os.path.isfile(script):
            payload = json.dumps({"error": "API bridge missing (scripts/invoke-api.js)"}).encode()
            return 500, payload, [("Content-Type", "application/json")]

        cmd = ["node", script, api_path, method, query]
        try:
            proc = subprocess.run(
                cmd,
                input=body,
                capture_output=True,
                cwd=ROOT,
                timeout=120,
                check=False,
            )
        except FileNotFoundError:
            payload = json.dumps(
                {"error": "Node.js not found. Install Node or use: npx vercel dev"}
            ).encode()
            return 500, payload, [("Content-Type", "application/json")]
        except subprocess.TimeoutExpired:
            payload = json.dumps({"error": "API request timed out"}).encode()
            return 504, payload, [("Content-Type", "application/json")]

        if proc.returncode != 0:
            err = (proc.stderr or b"").decode("utf-8", errors="replace")[:500]
            print(f"[api] node error ({api_path}): {err}")
            payload = json.dumps({"error": "API handler failed", "detail": err}).encode()
            return 500, payload, [("Content-Type", "application/json")]

        if proc.stderr:
            err_text = (proc.stderr or b"").decode("utf-8", errors="replace").strip()
            if err_text:
                print(f"[api] node stderr ({api_path}): {err_text}")

        try:
            data = json.loads(proc.stdout.decode("utf-8"))
        except json.JSONDecodeError:
            payload = json.dumps({"error": "Invalid API bridge response"}).encode()
            return 500, payload, [("Content-Type", "application/json")]

        status = int(data.get("status", 500))
        resp_body = data.get("body", "")
        if isinstance(resp_body, dict):
            resp_body = json.dumps(resp_body)
        resp_bytes = (
            resp_body.encode("utf-8") if isinstance(resp_body, str) else bytes(resp_body)
        )
        headers = [(k, str(v)) for k, v in (data.get("headers") or {}).items()]
        if not any(h[0].lower() == "content-type" for h in headers):
            headers.append(("Content-Type", "application/json"))
        return status, resp_bytes, headers

    def _handle_api(self, method: str) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or parsed.path
        if path.startswith("/api/get-report"):
            api_path = "/api/get-report"
        elif path == "/api/submit-assessment":
            api_path = "/api/submit-assessment"
        else:
            self.send_error(404, "API route not found")
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""

        status, resp_body, headers = self._invoke_api(
            api_path, method, parsed.query, body
        )
        self.send_response(status)
        for name, value in headers:
            self.send_header(name, value)
        self.send_header("Content-Length", str(len(resp_body)))
        self.end_headers()
        self.wfile.write(resp_body)

    def do_POST(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or parsed.path
        if path in API_ROUTES:
            self._handle_api("POST")
            return
        self.send_error(501, "Unsupported method ('POST')")

    def do_OPTIONS(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or parsed.path
        if path in API_ROUTES:
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", f"http://localhost:{PORT}")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            return
        self.send_error(501, "Unsupported method ('OPTIONS')")

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith("/api/get-report"):
            self._handle_api("GET")
            return
        self._do_get_static()


def main() -> None:
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT}/")
        print("  Static rewrites: /blog/:slug, /use-cases/:slug, cleanUrls")
        print("  API routes: POST /api/submit-assessment, GET /api/get-report (via Node)")
        print("  Requires: node, npm install, .env with Supabase keys")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
