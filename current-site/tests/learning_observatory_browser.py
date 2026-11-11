"""Smoke-test the Observatory against an actual locally served Aetheria build.

Usage:
  python -m http.server 8765 --directory _site &
  python current-site/tests/learning_observatory_browser.py
"""
import asyncio
import os
from playwright.async_api import async_playwright

BASE=os.environ.get("AETHERIA_BASE_URL","http://127.0.0.1:8765/")
WIDTHS=(390,820,1366)

async def smoke(width):
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        page=await browser.new_page(viewport={"width":width,"height":850},reduced_motion="reduce")
        errors=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        await page.goto(BASE,wait_until="domcontentloaded",timeout=30000)
        await page.locator("#majLearningObservatoryBtn").wait_for(timeout=20000)
        await page.evaluate("""() => {
          const t=Date.now();
          window.S.progress=window.S.progress||{};
          const p=window.S.progress.D772=window.S.progress.D772||{};
          p.answers=[
            {qid:'obs1',topicId:'independent-events',correct:false,assisted:true,source:'guided-reasoning',at:t-9*86400000},
            {qid:'obs2',topicId:'independent-events',correct:true,assisted:false,source:'independent-transfer',transfer:true,at:t-3*86400000},
            {qid:'obs3',topicId:'bias',correct:true,source:'unknown-legacy',at:t-2*86400000}
          ];
        }""")
        before=await page.evaluate("() => ({xp:window.S?.majickAccount?.xp||0, events:Object.keys(window.S?.majickAccount?.studyProgressBridge?.events||{}).length})")
        await page.locator("#majLearningObservatoryBtn").click()
        room=page.locator("#majLearningObservatory")
        await room.wait_for(timeout=5000)
        assert await room.get_by_text("My Learning Trends").count()==1
        assert await room.get_by_text("Mastery evidence",exact=False).count()>=1
        assert await room.get_by_text("Weekly performance trends").count()>=1
        assert await room.get_by_text("Evidence coverage by practice room").count()>=1
        assert await room.locator("#loExport").count()==1
        await room.locator("#loCourse").select_option("D772")
        assert await room.get_by_text("independent-events").count()>=1
        await room.locator("#loWindow").select_option("7")
        await room.locator("#loRefresh").click()
        after=await page.evaluate("() => ({xp:window.S?.majickAccount?.xp||0, events:Object.keys(window.S?.majickAccount?.studyProgressBridge?.events||{}).length})")
        assert before==after,(before,after)
        await room.locator("#loClose").click()
        assert await room.count()==0
        assert await page.locator("#majLearningObservatoryBtn").count()==1
        assert not errors,errors[:3]
        await browser.close()

async def main():
    for width in WIDTHS:
        await smoke(width)
        print(f"PASS Learning Observatory browser smoke at {width}px")

if __name__=="__main__":
    asyncio.run(main())
