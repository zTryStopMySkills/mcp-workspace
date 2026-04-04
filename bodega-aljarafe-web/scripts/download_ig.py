import urllib.request
import re
import os
import sys

POSTS = {
    "post-2":      "https://www.instagram.com/bodegasaljarafe/p/DOd1nEdiDoF/",
    "post-3":      "https://www.instagram.com/bodegasaljarafe/p/DNOoC4UsHz0/",
    "post-4":      "https://www.instagram.com/bodegasaljarafe/p/DBJcF0is9Wz/",
    "post-5":      "https://www.instagram.com/bodegasaljarafe/p/DBOia6KMZQ7/",
    "post-6":      "https://www.instagram.com/bodegasaljarafe/p/C_UGTDKIrBH/",
    "famosos-1":   "https://www.instagram.com/bodegasaljarafe/p/DMYwqIXMaJr/",
    "famosos-2":   "https://www.instagram.com/bodegasaljarafe/p/DMk1J1PMRtP/",
    "famosos-3":   "https://www.instagram.com/bodegasaljarafe/p/DOTogB7iBF8/",
    "famosos-4":   "https://www.instagram.com/bodegasaljarafe/p/DTjWFVICAE_/",
    "famosos-5":   "https://www.instagram.com/bodegasaljarafe/p/DTlGc-UCHmo/",
    "famosos-6":   "https://www.instagram.com/bodegasaljarafe/p/DTlxsmQiNv5/",
    "famosos-7":   "https://www.instagram.com/bodegasaljarafe/p/DUGsjz0CCAw/",
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
}

os.makedirs("public/gallery", exist_ok=True)

ok = 0
fail = 0
for name, url in POSTS.items():
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            import gzip
            raw = resp.read()
            try:
                html = gzip.decompress(raw).decode('utf-8', errors='ignore')
            except Exception:
                html = raw.decode('utf-8', errors='ignore')

        m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if not m:
            m = re.search(r'"display_url":"(https://[^"]+\.jpg[^"]*)"', html)

        if m:
            img_url = m.group(1).replace('\\u0026', '&').replace('\\/', '/')
            img_req = urllib.request.Request(img_url, headers=headers)
            with urllib.request.urlopen(img_req, timeout=15) as img_resp:
                data = img_resp.read()

            out = f"public/gallery/{name}.jpg"
            with open(out, 'wb') as f:
                f.write(data)
            print(f"OK {name} ({len(data)//1024}KB)")
            ok += 1
        else:
            print(f"NO_IMG {name}")
            fail += 1
    except Exception as e:
        print(f"ERR {name} {e}")
        fail += 1

print(f"\nDone: {ok} ok, {fail} fail")
