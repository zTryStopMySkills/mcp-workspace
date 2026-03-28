from playwright.sync_api import sync_playwright
import time, os

def click_pin(page, digits):
    for d in digits:
        page.locator(f'button:has-text("{d}")').first.click()
        time.sleep(0.15)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1400, "height": 900})
    page.goto('http://localhost:3002')
    page.wait_for_load_state('networkidle')
    click_pin(page, ['1','2','3','4','5','6'])
    page.wait_for_load_state('networkidle')
    time.sleep(2)

    # 1. Verificar cursor pointer en mesas del mapa
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(0.5)
    page.screenshot(path='/tmp/verify_01_dashboard.png')
    print("Screenshot 1: Dashboard con mapa")

    # 2. Hacer click en la mesa 01 (la que tiene estado "Pedido")
    # El mapa está en la sección "Sala en vivo"
    # Buscamos la mesa con numero "01"
    mesa_01 = page.locator('.salon-map-live-mesa, [data-mesa="01"]').first
    # Intentamos click en el primer div que contiene "01" dentro del mapa
    try:
        # Buscar por texto "01" dentro del contenedor del mapa
        page.locator('text=INTERIOR').first.click()
        time.sleep(1)
        page.screenshot(path='/tmp/verify_02_mesa_modal.png')
        print("Screenshot 2: Modal de mesa (click en zona INTERIOR)")
    except:
        # Alternativa: click en coordenadas del primer cuadro del mapa
        map_container = page.locator('text=Sala en vivo').first
        map_container.scroll_into_view_if_needed()
        time.sleep(0.3)
        page.screenshot(path='/tmp/verify_02_map_visible.png')
        print("Screenshot 2: Mapa visible para identificar mesas")

    # 3. Verificar que la imagen upload funciona probando el endpoint
    import urllib.request
    try:
        req = urllib.request.Request('http://localhost:3000/api/health')
        resp = urllib.request.urlopen(req)
        print(f"Backend health: {resp.read().decode()[:50]}")
    except Exception as e:
        print(f"Backend error: {e}")

    # 4. Verificar que el directorio public/static/platos existe o se crea bien
    fotos_dir_correcto = os.path.exists('restaurant-app/public/static/platos')
    fotos_dir_incorrecto = os.path.exists('restaurant-app/server/public/static/platos')
    print(f"Dir correcto (public/static/platos): {fotos_dir_correcto}")
    print(f"Dir incorrecto (server/public/...): {fotos_dir_incorrecto}")

    browser.close()
    print("Done")
