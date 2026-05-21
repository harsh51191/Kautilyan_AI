#!/usr/bin/env python3
"""Local dev server — mirrors vercel.json /blog/:slug → article.html?slug= rewrite."""
from __future__ import annotations

import http.server
import os
import socketserver
import urllib.parse

PORT = int(os.environ.get("PORT", "8080"))
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
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


def main() -> None:
    os.chdir(ROOT)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving {ROOT} at http://localhost:{PORT}/ (blog + use-case rewrites enabled)")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
