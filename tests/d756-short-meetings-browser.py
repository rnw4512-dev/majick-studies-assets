"""Verify five short D756 meetings use the original full-IEP rubric with a 15-minute cap."""
import os
from playwright.sync_api import sync_playwright
URL=os.environ.get("MAJICK_URL","http://127.0.0.1:8765/")
KEY="majick-d756-task2-rehearsal-v1"
cases={"fast-family":"angela","fast-student":"maya","fast-support":"jordan","fast-transition":"angela","fast-data":"maya"}
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/google-chrome"),args=["--no-sandbox"])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={"width":width,"height":850})
  page=context.new_page()
  errors=[]
  page.on("pageerror",lambda e:errors.append(str(e)))
  page.goto(URL)
  page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
  page.evaluate('switchCourse("D756");navigate("mission");studyRealmSwitch("practice")')
  assert page.get_by_text("15-minute full IEP simulations").count()==1
  assert page.get_by_text("Start 15-minute meeting").count()==5
  assert len(page.evaluate("MajickD756Meeting.shortMeetings()"))==5
  before=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  for scenario,profile in cases.items():
   assert page.evaluate("MajickD756Meeting.openShortMeeting("+repr(scenario)+")"),scenario
   room=page.locator("#d756MeetingRoom")
   assert room.locator("#dmProfile").input_value()==profile
   assert "15-minute" in room.inner_text()
   assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).shortMeeting')==scenario
   room.locator("[data-action=start]").click()
   assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).shortMeeting')==scenario
   assert room.locator("#dmAnswer").count()==1
   result=page.evaluate("MajickD756Meeting.assessment()")
   labels=[x[0] for x in result["checks"]]
   assert any("five" in x.lower() for x in labels)
   assert any("clarifying" in x.lower() for x in labels)
   assert any("three" in x.lower() and "goal" in x.lower() for x in labels)
   assert any("15-minute practice" in x for x in labels)
   assert not result["passed"]
   room.locator("[data-action=close]").click()
   # Explicitly clear this disposable browser's test run, never a real saved record.
   page.evaluate(f'localStorage.removeItem("{KEY}")')
   page.reload()
   page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
   page.evaluate('switchCourse("D756");navigate("mission");studyRealmSwitch("practice")')
  after=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  assert before==after,(before,after)
  assert not errors,errors
  print(f"PASS five full-IEP fifteen-minute drill presets and unchanged reward balance at {width}px")
  context.close()
 browser.close()
