import sys, os
sys.stdout.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "screenshots")
URL = "https://agentalia-webs.vercel.app"

results = []

def check(name, condition, detail=""):
    icon = "[OK]  " if condition else "[FAIL]"
    msg = f"  {icon} {name}"
    if detail:
        msg += f" ({detail})"
    print(msg)
    results.append((name, condition))

def run_tests(page):
    print(f"\n[-->] Loading {URL} ...")
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(URL, timeout=30000)
    page.wait_for_load_state("networkidle")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"[-->] Page loaded OK\n")

    # 1. Full-page screenshot
    print("=== 1. Full-page screenshot ===")
    page.screenshot(path=f"{OUTPUT_DIR}/00_full_page.png", full_page=True)
    check("Full page screenshot saved", os.path.exists(f"{OUTPUT_DIR}/00_full_page.png"))

    # 2. Section-by-section screenshots
    print("\n=== 2. Section screenshots ===")
    sections = {
        "hero":          None,
        "precios":       "#precios",
        "servicios":     "#servicios",
        "como-funciona": "#como-funciona",
        "resenas":       "#resenas",
        "presupuesto":   "#presupuesto",
    }
    for name, selector in sections.items():
        if selector:
            page.evaluate(f"document.querySelector('{selector}')?.scrollIntoView()")
            page.wait_for_timeout(800)
        else:
            page.evaluate("window.scrollTo(0, 0)")
            page.wait_for_timeout(400)
        path = f"{OUTPUT_DIR}/{name}.png"
        page.screenshot(path=path)
        check(f"Section '{name}' screenshot", os.path.exists(path))

    # 3. Layout checks
    print("\n=== 3. Layout checks ===")
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(300)

    sw = page.evaluate("document.documentElement.scrollWidth")
    iw = page.evaluate("window.innerWidth")
    overflow = sw > iw
    check("No horizontal overflow", not overflow, f"scrollWidth={sw} innerWidth={iw}")

    page.evaluate("document.querySelector('#como-funciona')?.scrollIntoView()")
    page.wait_for_timeout(600)
    how_grid = page.evaluate("""
        (() => {
            const grid = document.querySelector('#como-funciona .grid');
            if (!grid) return null;
            return window.getComputedStyle(grid).gridTemplateColumns;
        })()
    """)
    cols = how_grid.count("px") if how_grid else 0
    check("HowItWorks has 3-col grid on desktop", cols >= 3, f"gridTemplateColumns: {how_grid}")

    # 4. Hover interactions
    print("\n=== 4. Hover interactions ===")
    page.evaluate("document.querySelector('#precios')?.scrollIntoView()")
    page.wait_for_timeout(500)

    try:
        card = page.locator(".animated-border-card").first
        card.scroll_into_view_if_needed()
        card.hover()
        page.wait_for_timeout(500)
        page.screenshot(path=f"{OUTPUT_DIR}/planes_hover.png")
        check("Estándar card hover screenshot", os.path.exists(f"{OUTPUT_DIR}/planes_hover.png"))
    except Exception as e:
        check("Estándar card hover screenshot", False, str(e))

    try:
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(300)
        cta = page.locator("header button").filter(has_text="Solicitar presupuesto").first
        cta.hover()
        page.wait_for_timeout(400)
        page.screenshot(path=f"{OUTPUT_DIR}/navbar_cta_hover.png")
        check("Navbar CTA hover screenshot", os.path.exists(f"{OUTPUT_DIR}/navbar_cta_hover.png"))
    except Exception as e:
        check("Navbar CTA hover screenshot", False, str(e))

    # 5. Hero CTA scroll
    print("\n=== 5. Hero CTA navigation ===")
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(400)

    try:
        btn = page.locator("button").filter(has_text="Ver precios").first
        btn.click()
        page.wait_for_timeout(900)
        scroll_y = page.evaluate("window.scrollY")
        check("'Ver precios' scrolls page down", scroll_y > 100, f"scrollY={scroll_y}")
    except Exception as e:
        check("'Ver precios' scrolls page down", False, str(e))

    # 6. Quote form multi-step flow
    print("\n=== 6. Quote form flow ===")
    page.evaluate("document.querySelector('#presupuesto')?.scrollIntoView()")
    page.wait_for_timeout(700)
    page.screenshot(path=f"{OUTPUT_DIR}/form_step1.png")
    check("Form step 1 screenshot", os.path.exists(f"{OUTPUT_DIR}/form_step1.png"))

    try:
        page.locator("input[placeholder*='Bar El'], input[placeholder*='negocio'], input[placeholder*='Ej: Bar']").first.fill("Bar El Rincon")
        page.select_option("select", "Restaurante")
        page.wait_for_timeout(300)
        page.locator("button:has-text('Siguiente')").first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=f"{OUTPUT_DIR}/form_step2.png")
        check("Form Step 1 -> Step 2", os.path.exists(f"{OUTPUT_DIR}/form_step2.png"))

        page.locator("button:has-text('sico')").first.click()
        page.wait_for_timeout(300)
        page.locator("button:has-text('Siguiente')").first.click()
        page.wait_for_timeout(500)
        page.screenshot(path=f"{OUTPUT_DIR}/form_step3.png")
        check("Form Step 2 -> Step 3", os.path.exists(f"{OUTPUT_DIR}/form_step3.png"))

        page.locator("input[placeholder='Tu nombre']").fill("Juan Garcia")
        page.locator("input[placeholder='600 000 000']").fill("612345678")
        page.wait_for_timeout(300)
        submit = page.locator("button:has-text('Solicitar presupuesto')").first
        is_enabled = not submit.is_disabled()
        check("Submit button enabled after Step 3", is_enabled)
        page.screenshot(path=f"{OUTPUT_DIR}/form_ready_submit.png")

    except Exception as e:
        check("Quote form flow", False, str(e))


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []
    page = browser.new_page()
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))

    run_tests(page)

    print(f"\n=== Console / JS errors ({len(errors)}) ===")
    if errors:
        for e in errors:
            print(f"  [FAIL] {e}")
    else:
        print("  [OK]  No errors detected")

    passed = sum(1 for _, ok in results if ok)
    total = len(results)
    print(f"\n{'='*50}")
    print(f"Results: {passed}/{total} checks passed")
    if passed == total:
        print("[OK]  ALL CHECKS PASSED")
    else:
        failed = [name for name, ok in results if not ok]
        print(f"[FAIL] Failed: {', '.join(failed)}")
    print(f"\nScreenshots -> {OUTPUT_DIR}")
    browser.close()
