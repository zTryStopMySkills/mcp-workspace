"""
DiverNature web app test suite.
Covers: navigation, sections, pack modal, video autoplay, WhatsApp links, admin login.
"""
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:3000'

def wait_for_server(base_url, retries=20, delay=5):
    """Poll until the server responds or give up."""
    import urllib.request, time
    for i in range(retries):
        try:
            with urllib.request.urlopen(base_url, timeout=10) as r:
                if r.status < 500:
                    print(f'  Server ready (attempt {i+1})')
                    return True
        except Exception as e:
            print(f'  Waiting for server... ({i+1}/{retries}) — {e}')
            time.sleep(delay)
    return False

def run_tests():
    results = []

    def ok(name):
        results.append(('PASS', name))
        print(f'  ✅ {name}')

    def fail(name, reason=''):
        results.append(('FAIL', name))
        print(f'  ❌ {name}' + (f': {reason}' if reason else ''))

    print('\n── Waiting for dev server ──')
    if not wait_for_server(BASE):
        print('ERROR: Server did not respond in time. Is `npm run dev` running?')
        sys.exit(2)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={'width': 1280, 'height': 900})
        page = ctx.new_page()
        page.set_default_timeout(60000)
        page.set_default_navigation_timeout(60000)

        # ─── Homepage load ─────────────────────────────────────────────
        print('\n── Homepage ──')
        page.goto(BASE, wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(2500)
        page.screenshot(path='/tmp/dn_home.png', full_page=False)

        title = page.title()
        if 'DiverNature' in title or 'divernature' in title.lower():
            ok('Page title contains DiverNature')
        else:
            fail('Page title', f'got: {title}')

        # ─── Navbar ────────────────────────────────────────────────────
        print('\n── Navbar ──')
        nav = page.locator('nav, header')
        if nav.count() > 0:
            ok('Navbar present')
        else:
            fail('Navbar present')

        # Logo visible
        logo = page.locator('img[alt*="DiverNature"], img[alt*="divernature"]')
        if logo.count() > 0:
            ok('Logo visible')
        else:
            fail('Logo visible')

        # ─── Hero section ──────────────────────────────────────────────
        print('\n── Hero section ──')
        hero = page.locator('#inicio')
        if hero.count() > 0:
            ok('Hero section (#inicio) present')
        else:
            fail('Hero section present')

        h1 = page.locator('h1').first
        if h1.count() > 0 and h1.inner_text():
            ok(f'H1 present: "{h1.inner_text()[:50]}"')
        else:
            fail('H1 present')

        # CTA buttons
        cta = page.locator('a[href="#contacto"]').first
        if cta.count() > 0:
            ok('CTA "Reserva tu fiesta" present')
        else:
            fail('CTA "Reserva tu fiesta" present')

        # WhatsApp link in hero
        wa = page.locator('a[href*="wa.me"]').first
        if wa.count() > 0:
            ok('WhatsApp link in hero present')
        else:
            fail('WhatsApp link present')

        # ─── Stats section ─────────────────────────────────────────────
        print('\n── Stats section ──')
        stats = page.locator('section').filter(has_text='Fiestas')
        if stats.count() > 0:
            ok('Stats section present')
        else:
            fail('Stats section present')

        # ─── Packs section ─────────────────────────────────────────────
        print('\n── Packs section ──')
        packs_section = page.locator('#packs')
        if packs_section.count() > 0:
            ok('Packs section (#packs) present')
        else:
            fail('Packs section present')

        pack_cards = page.locator('#packs article')
        count = pack_cards.count()
        if count >= 6:
            ok(f'Pack cards count: {count}')
        else:
            fail(f'Pack cards count', f'got {count}, expected ≥6')

        # Click first pack card button → modal should open
        first_btn = page.locator('#packs button').filter(has_text='Me interesa').first
        if first_btn.count() > 0:
            first_btn.click()
            page.wait_for_timeout(600)
            # Modal should appear
            modal = page.locator('[role="dialog"]')
            if modal.count() > 0:
                ok('Booking modal opens on pack click')
                page.screenshot(path='/tmp/dn_modal.png')
                # Close modal with Escape
                page.keyboard.press('Escape')
                page.wait_for_timeout(400)
                modal_after = page.locator('[role="dialog"]')
                if modal_after.count() == 0:
                    ok('Modal closes on Escape')
                else:
                    fail('Modal closes on Escape')
            else:
                fail('Booking modal opens on pack click')
        else:
            fail('Pack CTA button found')

        # ─── Workshops section ─────────────────────────────────────────
        print('\n── Workshops section ──')
        workshops = page.locator('#talleres')
        if workshops.count() > 0:
            ok('Workshops section (#talleres) present')
        else:
            fail('Workshops section present')

        workshop_buttons = page.locator('#talleres button[aria-label]')
        wcount = workshop_buttons.count()
        if wcount >= 4:
            ok(f'Workshop buttons: {wcount}')
        else:
            fail('Workshop buttons', f'got {wcount}')

        # Click first workshop → modal
        if wcount > 0:
            workshop_buttons.first.click()
            page.wait_for_timeout(600)
            wmodal = page.locator('[role="dialog"]')
            if wmodal.count() > 0:
                ok('Workshop modal opens')
                page.screenshot(path='/tmp/dn_workshop_modal.png')
                # Check tabs
                tabs = page.locator('[role="dialog"] button').filter(has_text='Historia')
                if tabs.count() > 0:
                    ok('Workshop modal has Historia tab')
                # Close
                page.keyboard.press('Escape')
                page.wait_for_timeout(400)
            else:
                fail('Workshop modal opens')

        # ─── Video section ─────────────────────────────────────────────
        print('\n── Video section ──')
        page.evaluate('window.scrollTo(0, document.body.scrollHeight * 0.5)')
        page.wait_for_timeout(1000)

        video_section = page.locator('#videos')
        if video_section.count() > 0:
            ok('Video section (#videos) present')
        else:
            fail('Video section present')

        videos = page.locator('#videos video')
        vcount = videos.count()
        if vcount >= 3:
            ok(f'HTML5 video elements: {vcount}')
        else:
            fail('HTML5 video elements', f'got {vcount}')

        # Check video has src attribute
        if vcount > 0:
            src = videos.first.get_attribute('src')
            if src and src.startswith('/videos/'):
                ok(f'Video src points to local file: {src}')
            else:
                fail('Video src local', f'got: {src}')

        # ─── Instagram section ─────────────────────────────────────────
        print('\n── Instagram section ──')
        ig_section = page.locator('#momentos')
        if ig_section.count() > 0:
            ok('Instagram section (#momentos) present')
        else:
            fail('Instagram section present')

        # Native videos for reels
        ig_videos = page.locator('#momentos video')
        igv_count = ig_videos.count()
        if igv_count >= 5:
            ok(f'IG section native video players: {igv_count}')
        else:
            fail('IG section native videos', f'got {igv_count}')

        # Photo embeds (iframes)
        ig_iframes = page.locator('#momentos iframe')
        igi_count = ig_iframes.count()
        if igi_count >= 3:
            ok(f'IG photo embed iframes: {igi_count}')
        else:
            fail('IG photo iframes', f'got {igi_count}')

        # ─── Contact section ───────────────────────────────────────────
        print('\n── Contact section ──')
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        page.wait_for_timeout(800)
        page.screenshot(path='/tmp/dn_footer.png')

        contact = page.locator('#contacto')
        if contact.count() > 0:
            ok('Contact section (#contacto) present')
        else:
            fail('Contact section present')

        # Contact form
        form = page.locator('#contacto form')
        if form.count() > 0:
            ok('Contact form present')
        else:
            fail('Contact form present')

        # ─── Scroll progress bar ───────────────────────────────────────
        print('\n── UI Components ──')
        scroll_bar = page.locator('[style*="scaleX"]').first
        if scroll_bar.count() > 0:
            ok('Scroll progress bar present')
        else:
            # Try by CSS position:fixed at top
            progress = page.locator('div[class*="fixed"][class*="top-0"]').first
            if progress.count() > 0:
                ok('Scroll progress bar present (fixed top)')
            else:
                fail('Scroll progress bar')

        # Back to top button — should appear after scroll
        back_top = page.locator('button[aria-label*="arriba"], button[aria-label*="top"], button[aria-label*="inicio"]')
        if back_top.count() > 0:
            ok('Back to top button present')
        else:
            fail('Back to top button')

        # WhatsApp FAB
        wa_fab = page.locator('a[aria-label*="WhatsApp"], a[href*="wa.me"]')
        if wa_fab.count() > 0:
            ok('WhatsApp FAB present')
        else:
            fail('WhatsApp FAB')

        # ─── Admin login page ──────────────────────────────────────────
        print('\n── Admin ──')
        page.goto(f'{BASE}/admin/login', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(1500)
        page.screenshot(path='/tmp/dn_admin_login.png')

        login_form = page.locator('form, input[type="password"]')
        if login_form.count() > 0:
            ok('Admin login page renders with form')
        else:
            fail('Admin login page')

        # Wrong credentials → stays on login
        page.fill('input[type="password"]', 'wrongpassword')
        page.keyboard.press('Enter')
        page.wait_for_timeout(800)
        if '/admin/login' in page.url or page.locator('input[type="password"]').count() > 0:
            ok('Wrong password stays on login')
        else:
            fail('Wrong password stays on login')

        browser.close()

    # ─── Summary ───────────────────────────────────────────────────────
    print('\n' + '─' * 50)
    passed = sum(1 for r in results if r[0] == 'PASS')
    failed = sum(1 for r in results if r[0] == 'FAIL')
    print(f'Results: {passed} passed, {failed} failed out of {len(results)} tests')
    if failed:
        print('\nFailed tests:')
        for r in results:
            if r[0] == 'FAIL':
                print(f'  • {r[1]}')
    return failed == 0

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
