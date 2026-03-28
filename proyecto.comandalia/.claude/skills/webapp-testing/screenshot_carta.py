from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})  # mobile viewport
    page.goto('http://localhost:5173')
    page.wait_for_load_state('networkidle')
    page.screenshot(path='/tmp/carta_initial.png', full_page=True)
    print("Screenshot inicial tomado")
    print("URL:", page.url)
    print("Título:", page.title())

    # Show page content to understand what's rendered
    content = page.inner_text('body')
    print("Contenido:", content[:500])

    browser.close()
