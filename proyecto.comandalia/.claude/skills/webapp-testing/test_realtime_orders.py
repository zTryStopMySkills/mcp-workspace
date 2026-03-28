"""
End-to-end test: Client places an order → Cocina panel receives it in real-time via WebSocket.

Flow:
  1. Open cocina panel, authenticate with PIN 000000
  2. Verify WebSocket connects (EN LINEA indicator)
  3. Open client app with a valid mesa token
  4. Complete onboarding (language → name → payment mode)
  5. Add an item to the cart and submit the order
  6. Verify the order appears in cocina WITHOUT reloading the page

Screenshots saved to /tmp/test_realtime_orders/
"""

import os
import sys
import time
import json
import urllib.request
import urllib.error
from playwright.sync_api import sync_playwright, expect

SCREENSHOTS_DIR = "/tmp/test_realtime_orders"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

COCINA_URL  = "http://localhost:3001/cocina/"
CLIENT_BASE = "http://localhost:5174/mesa/"
API_BASE    = "http://localhost:3000"
ADMIN_PIN   = "123456"
COCINA_PIN  = "000000"

console_errors  = []   # collected from cocina page
cocina_ws_msgs  = []   # WebSocket frames received by cocina
client_console  = []


def ss(page, name):
    path = f"{SCREENSHOTS_DIR}/{name}.png"
    page.screenshot(path=path, full_page=True)
    print(f"  [screenshot] {path}")
    return path


def get_mesa_token():
    req = urllib.request.Request(
        f"{API_BASE}/api/admin/mesas",
        headers={"x-auth-pin": ADMIN_PIN},
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        mesas = json.loads(resp.read())
    # Pick mesa #1 (first active)
    mesa = next(m for m in mesas if m["activa"])
    print(f"  [api] Using mesa #{mesa['numero']} token={mesa['qr_token']}")
    return mesa["qr_token"], mesa["id"]


def run():
    token, mesa_id = get_mesa_token()
    client_url = f"{CLIENT_BASE}{token}"

    results = {
        "cocina_ws_connected": False,
        "cocina_ws_indicator_green": False,
        "order_sent_successfully": False,
        "order_appeared_in_cocina": False,
        "cocina_console_errors": [],
        "client_console_errors": [],
        "cocina_ws_messages_received": [],
        "ws_new_order_received": False,
        "summary": "",
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 900})

        # ────────────────────────────────────────────────────────────
        # COCINA PAGE SETUP
        # ────────────────────────────────────────────────────────────
        cocina_page = context.new_page()

        # Capture console errors from cocina
        def on_cocina_console(msg):
            entry = f"[{msg.type}] {msg.text}"
            console_errors.append(entry)
            if msg.type in ("error", "warning"):
                results["cocina_console_errors"].append(entry)

        cocina_page.on("console", on_cocina_console)

        # Intercept WebSocket frames on the cocina page
        def on_ws(ws):
            print(f"  [WS] cocina WebSocket opened: {ws.url}")
            results["cocina_ws_connected"] = True

            def on_frame_received(payload):
                try:
                    data = json.loads(payload)
                    cocina_ws_msgs.append(data)
                    results["cocina_ws_messages_received"].append(data)
                    print(f"  [WS ←] {data.get('type')} {json.dumps(data)[:120]}")
                    if data.get("type") == "NEW_ORDER":
                        results["ws_new_order_received"] = True
                except Exception:
                    pass

            def on_frame_sent(payload):
                try:
                    data = json.loads(payload)
                    print(f"  [WS →] {data.get('type')} {json.dumps(data)[:120]}")
                except Exception:
                    pass

            ws.on("framereceived", on_frame_received)
            ws.on("framesent", on_frame_sent)

        cocina_page.on("websocket", on_ws)

        # ── Step 1: Open cocina panel ──────────────────────────────
        print("\n[1] Opening cocina panel...")
        cocina_page.goto(COCINA_URL)
        cocina_page.wait_for_load_state("networkidle")
        ss(cocina_page, "01_cocina_pin_screen")
        print("  ✓ Cocina PIN screen loaded")

        # ── Step 2: Enter PIN 000000 ───────────────────────────────
        print("\n[2] Entering PIN 000000...")
        for digit in COCINA_PIN:
            btn = cocina_page.locator(f"button.keypad-btn", has_text=digit).first
            if not btn.is_visible():
                # Fallback: find button by text content
                btn = cocina_page.get_by_role("button", name=digit, exact=True).first
            btn.click()
            time.sleep(0.1)

        # Wait for authentication to complete (Kanban screen loads)
        cocina_page.wait_for_selector("text=EL OLIVO", timeout=8000)
        print("  ✓ PIN accepted, Kanban screen loaded")
        ss(cocina_page, "02_cocina_kanban_loaded")

        # ── Step 3: Check WebSocket connection indicator ───────────
        print("\n[3] Checking WebSocket connection status...")
        time.sleep(2)  # Give WS time to connect and authenticate

        # Look for WsIndicator text
        ws_indicator = cocina_page.locator("text=EN LINEA")
        reconecting  = cocina_page.locator("text=RECONECTANDO")

        if ws_indicator.is_visible():
            results["cocina_ws_indicator_green"] = True
            print("  ✓ WebSocket indicator: EN LINEA (green)")
        elif reconecting.is_visible():
            print("  ✗ WebSocket indicator: RECONECTANDO (red) — WS not connected!")
        else:
            print("  ? WebSocket indicator not found on screen")

        ss(cocina_page, "03_cocina_ws_status")

        # Count initial orders in Pendiente column
        initial_pendiente_count_text = cocina_page.locator("text=PENDIENTE").first.text_content()
        print(f"  [info] Cocina initial state captured")

        # Note initial card count
        initial_cards = cocina_page.locator("[class*='card'], [data-testid*='order']").count()
        # More reliably: count order cards by looking for mesa numbers in Pendiente col
        pendiente_col_items = cocina_page.locator("text=SIN COMANDAS").count()
        print(f"  [info] Columns showing 'SIN COMANDAS': {pendiente_col_items}")

        # ────────────────────────────────────────────────────────────
        # CLIENT PAGE SETUP
        # ────────────────────────────────────────────────────────────
        print(f"\n[4] Opening client app at {client_url}...")
        client_page = context.new_page()
        client_page.set_viewport_size({"width": 430, "height": 900})  # mobile viewport

        def on_client_console(msg):
            entry = f"[{msg.type}] {msg.text}"
            client_console.append(entry)
            if msg.type in ("error", "warning"):
                results["client_console_errors"].append(entry)

        client_page.on("console", on_client_console)

        # Also intercept client WS for debugging
        def on_client_ws(ws):
            print(f"  [WS] client WebSocket opened: {ws.url}")
            def on_frame(payload):
                try:
                    data = json.loads(payload)
                    print(f"  [client WS ←] {data.get('type')}")
                except Exception:
                    pass
            ws.on("framereceived", on_frame)

        client_page.on("websocket", on_client_ws)

        # Clear localStorage to force fresh onboarding (no saved comensal)
        client_page.goto(client_url)
        client_page.wait_for_load_state("networkidle")
        # Clear localStorage to ensure fresh onboarding flow
        client_page.evaluate("() => { localStorage.clear(); }")
        print("  [client] Cleared localStorage to force fresh onboarding")
        # Reload to apply clean state
        client_page.reload()
        client_page.wait_for_load_state("networkidle")
        ss(client_page, "04_client_initial")
        print(f"  [client] Page title: {client_page.title()}")
        print(f"  [client] URL: {client_page.url}")

        # ── Step 4b: WelcomeScreen — click "Ver la carta" ─────────
        print("\n[4b] WelcomeScreen: clicking 'Ver la carta'...")
        time.sleep(1)
        ver_carta = client_page.get_by_role("button", name="Ver la carta")
        if ver_carta.is_visible(timeout=4000):
            ver_carta.click()
            client_page.wait_for_load_state("networkidle")
            ss(client_page, "04b_after_welcome")
            print("  ✓ Clicked 'Ver la carta'")
        else:
            print("  → No WelcomeScreen or already past it")
            ss(client_page, "04b_no_welcome")

        # ── Step 5: Onboarding — Language ─────────────────────────
        print("\n[5] Onboarding: selecting language...")
        time.sleep(0.5)

        # Check if we're on language screen
        lang_selector = client_page.locator("text=Selecciona tu idioma")
        if lang_selector.is_visible(timeout=4000):
            print("  → Language screen detected")
            # Click Spanish (Español)
            espanol_btn = client_page.locator("text=Español").first
            if espanol_btn.is_visible():
                espanol_btn.click()
            else:
                # Click the first language button
                client_page.locator("button").first.click()
            client_page.wait_for_load_state("networkidle")
            ss(client_page, "05_after_language")
            print("  ✓ Language selected")
        else:
            print("  → No language screen (already selected or skipped)")
            ss(client_page, "05_no_language_screen")

        # ── Step 6: Onboarding — Name ──────────────────────────────
        print("\n[6] Onboarding: entering name...")
        time.sleep(1)

        nombre_input = client_page.locator("input[placeholder*='nombre'], input[placeholder*='name'], input[placeholder*='Nombre']").first
        if nombre_input.is_visible(timeout=4000):
            print("  → Name input detected")
            nombre_input.fill("TestBot")
            nombre_input.press("Enter")
            time.sleep(0.5)

            # Click Continuar button if present
            continuar_btn = client_page.get_by_role("button", name="Continuar").first
            if continuar_btn.is_visible(timeout=2000):
                continuar_btn.click()

            client_page.wait_for_load_state("networkidle")
            ss(client_page, "06_after_name")
            print("  ✓ Name entered: TestBot")
        else:
            print("  → No name input visible")
            ss(client_page, "06_no_name_screen")
            # Take DOM snapshot for debugging
            print("  [debug] Page content snippet:")
            print(client_page.content()[:500])

        # ── Step 7: Onboarding — Payment mode ─────────────────────
        print("\n[7] Onboarding: selecting payment mode...")
        time.sleep(1)

        modo_screen = client_page.locator("text=¿Cómo queréis pagar?")
        if modo_screen.is_visible(timeout=4000):
            print("  → Modo screen detected")
            # Click 'Solo mi cuenta' (individual)
            solo_btn = client_page.get_by_role("button", name="Solo mi cuenta").first
            if solo_btn.is_visible():
                solo_btn.click()
            else:
                client_page.locator("button").nth(0).click()
            client_page.wait_for_load_state("networkidle")
            ss(client_page, "07_after_modo")
            print("  ✓ Modo selected: individual")
        else:
            print("  → No modo screen visible (already set or skipped)")
            ss(client_page, "07_no_modo_screen")

        # ── Step 8: Menu — Add item to cart ───────────────────────
        print("\n[8] Menu: adding item to cart...")
        time.sleep(1.5)

        # Check we're on the carta/menu screen
        ss(client_page, "08_before_add_to_cart")
        print(f"  [client] Current URL: {client_page.url}")
        print(f"  [client] All buttons on screen:")
        all_btns = client_page.locator("button").all()
        for i, b in enumerate(all_btns[:10]):
            try:
                txt = b.text_content()
                print(f"    [{i}] '{txt[:40].strip()}'")
            except Exception:
                pass

        # The PlatoCard has a + button (role="button" with text "+") at bottom-right
        # It calls e.stopPropagation() so clicking it adds to cart without opening detail
        # IMPORTANT: we must click the + button *inside* the PlatoCard, not the DetalleScreen +
        # The PlatoCard + button is a <button> with text "+" inside the card
        # Strategy: find all + buttons, pick the one NOT inside DetalleScreen
        # On carta screen, only PlatoCard + buttons exist (no DetalleScreen yet)
        add_btn = client_page.locator("button").filter(has_text="+").first
        if add_btn.is_visible(timeout=5000):
            add_btn.click()
            print("  ✓ Clicked + to add first item to cart")
            time.sleep(0.8)
            ss(client_page, "09_item_added_to_cart")

            # Debug: check if we're still on carta or went to detail
            print(f"  [client] After + click, buttons:")
            all_btns_after = client_page.locator("button").all()
            for i, b in enumerate(all_btns_after[:5]):
                try:
                    print(f"    [{i}] '{b.text_content()[:40].strip()}'")
                except Exception:
                    pass
        else:
            print("  ✗ Could not find + button for adding to cart")
            ss(client_page, "09_no_add_button")

        # ── Step 9: Open cart via CarritoBarra ────────────────────
        print("\n[9] Opening cart via CarritoBarra...")
        time.sleep(0.5)

        # CarritoBarra text pattern: "1 plato — Ver pedido" or "N platos — Ver pedido"
        # It's a div with role="button"
        ver_pedido = client_page.locator("[role='button']").filter(has_text="Ver pedido").first
        if ver_pedido.is_visible(timeout=3000):
            ver_pedido.click()
            print("  ✓ Clicked CarritoBarra 'Ver pedido'")
        else:
            # Maybe we're on detail screen — go back first
            volver_btn = client_page.locator("button").filter(has_text="Volver").first
            if volver_btn.is_visible(timeout=2000):
                print("  → On detail screen, going back first")
                volver_btn.click()
                time.sleep(0.5)
                # Now find + button on carta screen
                add_btn2 = client_page.locator("button").filter(has_text="+").first
                if add_btn2.is_visible(timeout=3000):
                    add_btn2.click()
                    print("  ✓ Added item from carta screen")
                    time.sleep(0.8)
                # Try CarritoBarra again
                ver_pedido2 = client_page.locator("[role='button']").filter(has_text="Ver pedido").first
                if ver_pedido2.is_visible(timeout=3000):
                    ver_pedido2.click()
                    print("  ✓ Clicked CarritoBarra 'Ver pedido' (2nd attempt)")
                else:
                    print("  ✗ CarritoBarra not found after going back")
            else:
                print("  ✗ Could not find CarritoBarra or Volver button")
                all_btns_dbg = client_page.locator("button, [role='button']").all()
                print(f"  [debug] All interactive elements ({len(all_btns_dbg)}):")
                for i, b in enumerate(all_btns_dbg[:8]):
                    try:
                        print(f"    [{i}] '{b.text_content()[:50].strip()}'")
                    except Exception:
                        pass

        time.sleep(1)
        ss(client_page, "10_carrito_screen")
        print(f"  [client] Buttons on carrito screen:")
        carrito_btns = client_page.locator("button").all()
        for i, b in enumerate(carrito_btns[:8]):
            try:
                print(f"    [{i}] '{b.text_content()[:40].strip()}'")
            except Exception:
                pass

        # ── Step 10: Submit order ──────────────────────────────────
        print("\n[10] Submitting order...")
        # CarritoScreen has "Enviar pedido a cocina" button (enviar_cocina key in i18n)
        enviar_btn = client_page.locator("button").filter(has_text="Enviar pedido a cocina").first
        if not enviar_btn.is_visible(timeout=2000):
            # Fallback: any button containing "Enviar"
            enviar_btn = client_page.locator("button").filter(has_text="Enviar").first

        if enviar_btn.is_visible(timeout=3000):
            enviar_btn.click()
            print("  → Clicked 'Enviar pedido a cocina' button")
            time.sleep(0.5)
            ss(client_page, "11_confirm_modal")

            # Confirm order in modal — "Confirmar pedido" button
            confirmar_btn = client_page.locator("button").filter(has_text="Confirmar pedido").first
            if not confirmar_btn.is_visible(timeout=2000):
                confirmar_btn = client_page.locator("button").filter(has_text="Confirmar").first
            if confirmar_btn.is_visible(timeout=3000):
                confirmar_btn.click()
                print("  ✓ Confirmed order")
                time.sleep(2)
                results["order_sent_successfully"] = True
                ss(client_page, "12_after_order_sent")
            else:
                print("  ✗ Confirm button not found in modal")
                all_btns_dbg = client_page.locator("button").all()
                for i, b in enumerate(all_btns_dbg[:6]):
                    try:
                        print(f"    [{i}] '{b.text_content()[:40].strip()}'")
                    except Exception:
                        pass
                ss(client_page, "11_no_confirm_button")
        else:
            print("  ✗ 'Enviar' button not found")
            all_btns = client_page.locator("button").all()
            print(f"  [debug] All buttons ({len(all_btns)}):")
            for i, b in enumerate(all_btns[:8]):
                try:
                    txt = b.text_content()
                    print(f"    [{i}] '{txt[:40].strip()}'")
                except Exception:
                    pass
            ss(client_page, "11_enviar_not_found")

        # ── Step 11: Check cocina for new order ───────────────────
        print("\n[11] Checking if order appeared in cocina panel (real-time)...")
        # Wait up to 5 seconds for the new order to appear
        NEW_ORDER_TIMEOUT = 5000

        # Focus back on cocina page
        cocina_page.bring_to_front()

        # Check if ws_new_order_received flag was set by WebSocket listener
        time.sleep(3)  # Give enough time for WS broadcast

        ss(cocina_page, "13_cocina_after_order")

        # Check for NEW_ORDER in received WS messages
        if results["ws_new_order_received"]:
            print("  ✓ NEW_ORDER received via WebSocket!")
        else:
            print("  ✗ No NEW_ORDER message received via WebSocket")

        # Check if order card appeared visually
        # The Kanban board shows orders in columns; look for mesa number or order card
        try:
            # Look for order cards — they typically show mesa number
            # After order, "SIN COMANDAS" count should decrease in Pendiente column
            order_card = cocina_page.locator("text=MESA").first
            if order_card.is_visible(timeout=3000):
                results["order_appeared_in_cocina"] = True
                print("  ✓ Order card visible in cocina Kanban!")
            else:
                # Check if Pendiente column no longer says "SIN COMANDAS"
                # Count how many "SIN COMANDAS" are now shown
                sin_comandas_after = cocina_page.locator("text=SIN COMANDAS").count()
                if sin_comandas_after < 3:  # was 3 (all empty), now at least one col has orders
                    results["order_appeared_in_cocina"] = True
                    print(f"  ✓ Order appeared in cocina! SIN COMANDAS count: {sin_comandas_after} (was 3)")
                else:
                    print(f"  ✗ No order appeared in cocina. SIN COMANDAS count: {sin_comandas_after}")
        except Exception as e:
            print(f"  ✗ Error checking cocina order appearance: {e}")

        ss(cocina_page, "14_cocina_final_state")

        # ── Print console logs for debugging ──────────────────────
        print("\n─── Cocina console logs (errors/warnings) ───")
        for entry in results["cocina_console_errors"][:20]:
            print(f"  {entry}")
        if not results["cocina_console_errors"]:
            print("  (none)")

        print("\n─── Client console logs (errors/warnings) ───")
        for entry in results["client_console_errors"][:20]:
            print(f"  {entry}")
        if not results["client_console_errors"]:
            print("  (none)")

        print("\n─── WebSocket messages received by cocina ───")
        for msg in results["cocina_ws_messages_received"]:
            print(f"  {msg}")
        if not results["cocina_ws_messages_received"]:
            print("  (none)")

        browser.close()

    # ── Final Report ──────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("FINAL REPORT")
    print("=" * 60)
    print(f"  Cocina WS connected (socket opened):    {'✓ YES' if results['cocina_ws_connected'] else '✗ NO'}")
    print(f"  Cocina WS indicator 'EN LINEA':         {'✓ YES' if results['cocina_ws_indicator_green'] else '✗ NO'}")
    print(f"  Order sent by client:                   {'✓ YES' if results['order_sent_successfully'] else '✗ NO'}")
    print(f"  NEW_ORDER WS msg received by cocina:    {'✓ YES' if results['ws_new_order_received'] else '✗ NO'}")
    print(f"  Order visible in cocina Kanban:         {'✓ YES' if results['order_appeared_in_cocina'] else '✗ NO'}")
    print(f"  Cocina console errors:                  {len(results['cocina_console_errors'])}")
    print(f"  Client console errors:                  {len(results['client_console_errors'])}")
    print(f"\nScreenshots saved to: {SCREENSHOTS_DIR}/")

    # Diagnosis
    print("\n─── DIAGNOSIS ───")
    if not results["cocina_ws_connected"]:
        print("  PROBLEM: Cocina WebSocket never opened. Check WS URL and server.")
    elif not results["cocina_ws_indicator_green"]:
        print("  PROBLEM: WS socket opened but AUTH handshake may have failed.")
    elif not results["order_sent_successfully"]:
        print("  PROBLEM: Could not complete the order flow in client app.")
    elif not results["ws_new_order_received"]:
        print("  PROBLEM: Order was sent but cocina WS never received NEW_ORDER broadcast.")
        print("  Possible causes:")
        print("    - Client sends order via REST API (/api/pedido) but server may not")
        print("      broadcast NEW_ORDER to cocina WebSocket room after saving to DB.")
        print("    - Check server/src/routes/api.js POST /api/pedido handler.")
        print("    - Check server/src/services/orderService.js createOrder().")
    elif not results["order_appeared_in_cocina"]:
        print("  PROBLEM: NEW_ORDER received via WS but UI did not update.")
        print("  Possible causes:")
        print("    - Cocina hook not handling NEW_ORDER to add order to state.")
        print("    - Check cocina/src/hooks/useCocinaPanel.js WS message handler.")
    else:
        print("  ✓ Everything working correctly! Real-time order delivery is functional.")

    return results


if __name__ == "__main__":
    run()
