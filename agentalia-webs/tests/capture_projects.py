import sys, os
sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

PROJECTS = [
    ("rincon-salteras",  "https://rincon-salteras.vercel.app"),
    ("shisha-vaper",     "https://shisha-vaper-web.vercel.app"),
    ("chantarela",       "https://chantarela-web.vercel.app"),
    ("twinbros",         "https://twinbros-web.vercel.app"),
    ("bar-ryky",         "https://bar-ryky-web.vercel.app"),
]

OUT_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "..", "public", "projects"
)

def capture(page, slug, url):
    print(f"  Capturing {slug}  ->  {url}")
    try:
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto(url, timeout=30000)
        page.wait_for_load_state("networkidle")
        # Hide cookie banners / popups if any
        page.evaluate("""
            document.querySelectorAll('[class*=cookie],[class*=banner],[class*=popup],[class*=modal]')
                .forEach(el => el.style.display = 'none');
        """)
        page.wait_for_timeout(800)
        dest = os.path.join(OUT_DIR, f"{slug}.jpg")
        page.screenshot(path=dest, type="jpeg", quality=85, clip={"x": 0, "y": 0, "width": 1440, "height": 900})
        print(f"  [OK]  {dest}")
        return True
    except Exception as e:
        print(f"  [FAIL] {slug}: {e}")
        return False


os.makedirs(OUT_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    ok = 0
    for slug, url in PROJECTS:
        if capture(page, slug, url):
            ok += 1
    browser.close()

print(f"\nDone: {ok}/{len(PROJECTS)} screenshots saved to {OUT_DIR}")
