"""Capture screenshots of the new showcase projects."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

PROJECTS = [
    ("comandalia", "https://landing-mh3z04qef-jose2dacount-3890s-projects.vercel.app"),
    ("bar-la-espuela", "https://bar-la-espuela.vercel.app"),
    ("twinbros-web", "https://twinbros-web.vercel.app"),
    ("el-dichoso", "https://dichoso-web.vercel.app"),
    ("bodegas-aljarafe", "https://bodega-aljarafe-web.vercel.app"),
]

OUTPUT = Path(__file__).parent.parent / "public" / "projects"
OUTPUT.mkdir(parents=True, exist_ok=True)


async def capture(page, slug, url):
    try:
        await page.goto(url, timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)
        out = OUTPUT / f"{slug}.jpg"
        await page.screenshot(path=str(out), type="jpeg", quality=85, clip={"x": 0, "y": 0, "width": 1440, "height": 900})
        print(f"OK {slug} -> {out.name}")
    except Exception as e:
        print(f"FAIL {slug}: {e}")


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        for slug, url in PROJECTS:
            await capture(page, slug, url)
        await browser.close()


asyncio.run(main())
