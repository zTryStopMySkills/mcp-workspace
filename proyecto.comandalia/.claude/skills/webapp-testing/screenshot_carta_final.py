import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from playwright.sync_api import sync_playwright
import json

TOKEN = "faae61b3-4e69-432c-b97a-47aa254922ce"
MESA_ID = 1

# Comensal simulado
comensal = {"nombre": "Carlos", "color": "#e8a020", "emoji": "🍽️"}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})

    # First load the page to set localStorage
    page.goto(f'http://localhost:5173/mesa/{TOKEN}')
    page.wait_for_load_state('domcontentloaded')

    # Inject comensal in localStorage to skip onboarding
    page.evaluate(f"""() => {{
        localStorage.setItem('comensal_{MESA_ID}', JSON.stringify({json.dumps(comensal)}));
        localStorage.setItem('idioma', 'es');
    }}""")

    # Reload to pick up localStorage
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)

    page.screenshot(path='/tmp/carta_screen.png', full_page=True)
    print("CartaScreen capturado!")

    # Also scroll down a bit to see more platos
    page.mouse.wheel(0, 300)
    page.wait_for_timeout(500)
    page.screenshot(path='/tmp/carta_screen_scroll.png', full_page=True)
    print("CartaScreen scrolled capturado!")

    browser.close()
