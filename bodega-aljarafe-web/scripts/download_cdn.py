import instaloader
import urllib.request
import os

L = instaloader.Instaloader(
    download_pictures=False,
    download_videos=False,
    download_video_thumbnails=False,
    save_metadata=False,
    post_metadata_txt_pattern='',
    quiet=True,
)

TARGETS = {
    # platos / comida
    "post-2":       "DOd1nEdiDoF",
    "post-3":       "DNOoC4UsHz0",
    "post-4":       "DBJcF0is9Wz",
    "post-5":       "DBOia6KMZQ7",
    "post-6":       "C_UGTDKIrBH",
    # famosos / visitas
    "famosos-1":    "DMYwqIXMaJr",
    "famosos-2":    "DMk1J1PMRtP",
    "famosos-3":    "DOTogB7iBF8",
    "famosos-5":    "DTlGc-UCHmo",
    "famosos-6":    "DTlxsmQiNv5",
    "famosos-7":    "DUGsjz0CCAw",
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Referer': 'https://www.instagram.com/',
}

os.makedirs("public/gallery", exist_ok=True)

ok = 0
fail = 0

for name, shortcode in TARGETS.items():
    out = f"public/gallery/{name}.jpg"
    if os.path.exists(out) and os.path.getsize(out) > 10000:
        print(f"SKIP {name} (already exists)")
        ok += 1
        continue
    try:
        post = instaloader.Post.from_shortcode(L.context, shortcode)
        # Para carruseles, coger la primera imagen
        if post.typename == 'GraphSidecar':
            url = next(post.get_sidecar_nodes()).display_url
        else:
            url = post.url

        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as r:
            data = r.read()

        with open(out, 'wb') as f:
            f.write(data)
        print(f"OK {name} ({len(data)//1024}KB) — {shortcode}")
        ok += 1
    except Exception as e:
        print(f"ERR {name} ({shortcode}): {e}")
        fail += 1

print(f"\nResultado: {ok} descargadas, {fail} errores")
