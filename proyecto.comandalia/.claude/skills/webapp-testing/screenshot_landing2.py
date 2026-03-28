import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000/landing/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)

    sections = [5400, 6300, 7200, 8100, 9000, 9900]
    for i, y in enumerate(sections):
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(600)
        page.screenshot(path=f'/tmp/landing_s{i+7}.png')
        print(f"Section {i+7} at y={y}")

    browser.close()
