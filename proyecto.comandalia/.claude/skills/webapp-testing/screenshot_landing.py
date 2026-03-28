import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto('http://localhost:3000/landing/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)

    # Full page screenshot
    page.screenshot(path='/tmp/landing_full.png', full_page=True)
    print("Full page captured")

    # Get total page height
    height = page.evaluate("document.body.scrollHeight")
    print(f"Page height: {height}px")

    # Section screenshots by scrolling
    sections = [0, 900, 1800, 2700, 3600, 4500]
    for i, y in enumerate(sections):
        if y >= height:
            break
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(600)
        page.screenshot(path=f'/tmp/landing_s{i+1}.png')
        print(f"Section {i+1} at y={y} captured")

    browser.close()
    print("Done")
