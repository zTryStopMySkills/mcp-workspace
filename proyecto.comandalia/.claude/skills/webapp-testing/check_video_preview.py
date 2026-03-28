import sys
from playwright.sync_api import sync_playwright

PIN = '123456'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console errors
    errors = []
    page.on('console', lambda msg: errors.append(f"[{msg.type}] {msg.text}") if msg.type == 'error' else None)
    page.on('pageerror', lambda err: errors.append(f"[pageerror] {err}"))

    page.goto('http://localhost:3100/admin/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    for digit in PIN:
        page.locator(f'button:has-text("{digit}")').first.click()
        page.wait_for_timeout(150)

    page.wait_for_timeout(2000)

    # Go to Ajustes
    page.locator('text=Ajustes').first.click()
    page.wait_for_timeout(2000)

    page.screenshot(path='/tmp/ajustes_video.png', full_page=True)
    sys.stdout.buffer.write(b"Screenshot saved: /tmp/ajustes_video.png\n")

    # Check video elements
    videos = page.locator('video').all()
    sys.stdout.buffer.write(f"Video elements: {len(videos)}\n".encode())
    for i, v in enumerate(videos):
        src = v.get_attribute('src') or ''
        sys.stdout.buffer.write(f"  video[{i}] src='{src[:80]}'\n".encode())

    # Check img elements with mp4 src (broken)
    imgs = page.locator('img').all()
    broken = []
    for img in imgs:
        src = img.get_attribute('src') or ''
        if '.mp4' in src:
            broken.append(src[:80])
    if broken:
        sys.stdout.buffer.write(f"BROKEN: img tags with mp4 src: {broken}\n".encode())
    else:
        sys.stdout.buffer.write(b"OK: No img tags with mp4 src\n")

    # Console errors
    if errors:
        sys.stdout.buffer.write(b"Console errors:\n")
        for e in errors[:10]:
            sys.stdout.buffer.write(f"  {e[:120]}\n".encode())

    sys.stdout.buffer.flush()
    browser.close()
