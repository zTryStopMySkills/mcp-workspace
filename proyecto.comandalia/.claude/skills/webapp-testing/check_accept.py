import sys
from playwright.sync_api import sync_playwright

PIN = '123456'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    page.goto('http://localhost:3100/admin/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    # Enter PIN
    for digit in PIN:
        page.locator(f'button:has-text("{digit}")').first.click()
        page.wait_for_timeout(150)

    page.wait_for_timeout(1500)

    # Navigate to Ajustes
    try:
        page.locator('text=Ajustes').first.click()
        page.wait_for_timeout(1500)
    except Exception as e:
        sys.stdout.buffer.write(f"Could not click Ajustes: {e}\n".encode('utf-8'))

    page.wait_for_timeout(500)

    # Check ALL file inputs
    inputs = page.locator('input[type="file"]').all()
    sys.stdout.buffer.write(f"File inputs found: {len(inputs)}\n".encode('utf-8'))

    all_ok = True
    for i, inp in enumerate(inputs):
        accept = inp.get_attribute('accept') or ''
        has_mp4 = 'mp4' in accept
        has_mov = 'mov' in accept
        has_webm = 'webm' in accept
        ok = has_mp4 or has_webm
        if not ok:
            all_ok = False
        status = "OK" if ok else "MISSING VIDEO"
        sys.stdout.buffer.write(f"  [{i}] {status} | accept='{accept[:80]}'\n".encode('utf-8'))

    sys.stdout.buffer.write(f"\nResult: {'ALL OK - videos seleccionables' if all_ok else 'FAIL - algunos inputs sin video'}\n".encode('utf-8'))
    sys.stdout.buffer.flush()

    page.screenshot(path='/tmp/ajustes_final.png', full_page=True)
    sys.stdout.buffer.write(b"Screenshot: /tmp/ajustes_final.png\n")
    sys.stdout.buffer.flush()

    browser.close()
