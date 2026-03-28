from playwright.sync_api import sync_playwright
import time

TOKEN = "faae61b3-4e69-432c-b97a-47aa254922ce"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    # Navigate with token
    page.goto(f'http://localhost:5173/mesa/{TOKEN}')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)
    page.screenshot(path='/tmp/carta_welcome.png', full_page=True)
    print("Welcome screen capturado")

    # Click "Empezar" or whatever start button exists
    try:
        page.locator('button').first.click()
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(800)
        page.screenshot(path='/tmp/carta_after_click1.png', full_page=True)
        print("After click 1")
    except Exception as e:
        print(f"Error click 1: {e}")

    # Try to navigate through all screens to reach Carta
    buttons = page.locator('button').all()
    for b in buttons:
        print("Button:", b.inner_text())

    browser.close()
