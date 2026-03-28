import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000/landing/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1200)

    for i, y in enumerate([0, 900, 1800, 2700, 3600]):
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(400)
        page.screenshot(path=f'/tmp/v2_s{i+1}.png')
        print(f"s{i+1} y={y}")

    browser.close()
