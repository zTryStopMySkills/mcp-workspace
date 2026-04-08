"""Capture Comandalia screenshot from local HTML file."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

HTML_PATH = Path("C:/Users/jose2/OneDrive/Escritorio/mcp/proyecto.comandalia/restaurant-app/landing/index.html")
OUTPUT = Path("C:/Users/jose2/OneDrive/Escritorio/mcp/agentalia-webs/public/projects/comandalia.jpg")

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1440, "height": 900})
        await page.goto(f"file:///{HTML_PATH.as_posix()}", wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)
        await page.screenshot(path=str(OUTPUT), type="jpeg", quality=90,
                              clip={"x": 0, "y": 0, "width": 1440, "height": 900})
        print(f"OK: {OUTPUT.name}")
        await browser.close()

asyncio.run(main())
