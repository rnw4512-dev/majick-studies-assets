"""Live Chromium smoke for the optional D756 classroom writing conversation.
No real learner account or reward mutations are used.
"""
import os
from playwright.sync_api import sync_playwright
URL=os.environ.get("MAJICK_URL","http://127.0.0.1:8765/")
KEY="majick-d756-task2-rehearsal-v1"
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/google-chrome"),args=["--no-sandbox"])
 for width in (390,820,1366):
  context=browser.new_context(viewport={"width":width,"height":850})
  page=context.new_page()
  page.goto(URL)
  page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
  page.evaluate('switchCourse("D756"); MajickD756Meeting.open()')
  room=page.locator("#d756MeetingRoom")
  room.locator("#dmProfile").select_option("angela")
  room.locator("#dmStoryline").select_option("classroom-writing")
  room.locator("#dmMode").select_option("guided")
  before=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  room.locator("[data-action=start]").click()
  assert "classroom-writing" == page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).storyline')
  assert "previous meetings" in room.locator(".dmPrompt").inner_text().lower()
  room.locator("#dmAnswer").fill("Elena, what do you think about how Angela is doing in school and the decisions we will discuss in her IEP?")
  room.locator("[data-action=submit]").click()
  state=page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}"))')
  assert state["pending"] and state["pending"]["who"]==0,state
  room.locator("[data-action=close]").click()
  page.evaluate('MajickD756Meeting.open()')
  assert "classroom-writing" == page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).storyline')
  room.locator("[data-action=resume]").click()
  assert "school" in room.locator(".dmPrompt").inner_text().lower() or "confidence" in room.locator(".dmPrompt").inner_text().lower()
  after=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  assert before==after,(before,after)
  print(f"PASS optional responsive classroom conversation {width}px")
  context.close()
 browser.close()
