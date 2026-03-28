import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000/landing/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    # Scroll to demo section
    page.evaluate("document.getElementById('demo').scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/demo_t0.png')
    print("Demo t=0 capturado (justo al scrollear)")

    # Wait 3 seconds - should be past QR screen and into lang screen
    page.wait_for_timeout(3000)
    page.screenshot(path='/tmp/demo_t3.png')
    print("Demo t=3s")

    # Wait 4 more seconds - should be in menu
    page.wait_for_timeout(4000)
    page.screenshot(path='/tmp/demo_t7.png')
    print("Demo t=7s")

    # Wait 8 more seconds - confirm/success screen
    page.wait_for_timeout(8000)
    page.screenshot(path='/tmp/demo_t15.png')
    print("Demo t=15s")

    browser.close()
