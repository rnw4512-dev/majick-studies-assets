"""Eight distinct D756 meeting scenarios, full coached responses, evidence isolation.
No real learner data; each viewport uses fresh browser state.
"""
import os
from playwright.sync_api import sync_playwright
URL=os.environ.get("MAJICK_URL","http://127.0.0.1:8765/")
CASES=["standard","classroom-writing","family-goals","student-voice","support-conflict","transition-pathway","progress-stalled","time-pressure"]
KEY="majick-d756-task2-rehearsal-v1"
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/google-chrome"),args=["--no-sandbox"])
 for width in (390,820,1366):
  ctx=browser.new_context(viewport={"width":width,"height":880})
  page=ctx.new_page()
  errors=[]
  page.on("pageerror",lambda error:errors.append(str(error)))
  page.goto(URL)
  page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
  page.evaluate('switchCourse("D756")')
  page.evaluate('navigate("mission");studyRealmSwitch("practice")')
  assert page.get_by_text("Choose a meeting practice scenario").count()>0
  assert page.locator('button[onclick*="openScenario"]').count()==8, "Eight unique meeting scenario launchers must be present"
  api=page.evaluate("MajickD756Meeting.scenarios()")
  assert sorted(v["id"] for v in api)==sorted(CASES),api
  for case in CASES:
   assert page.evaluate("MajickD756Meeting.openScenario("+repr(case)+")")
   room=page.locator("#d756MeetingRoom")
   assert room.locator("#dmStoryline").input_value()==case
   assert room.locator("#dmScenarioDescription").inner_text().strip()
   assert "Angela Madina" in room.locator(".dmReference").inner_text()
   room.locator("#dmMode").select_option("guided")
   room.locator("[data-action=start]").click()
   buttons=room.locator("[data-response-choice]")
   assert buttons.count()==3,(case,buttons.count())
   for i in range(3):
    body=buttons.nth(i).inner_text()
    assert len(body.split())>=55,(case,i,len(body.split()))
    assert "Angela" in body or "Elena" in body or "Moore" in body,(case,i,body)
   buttons.first.click()
   answer=room.locator("#dmAnswer").input_value()
   assert len(answer.split())>=50,(case,answer)
   assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).assistedStage') is True
   room.locator("[data-action=close]").click()
   # Start a fresh session without preserving a running one.
   page.evaluate(f'localStorage.removeItem("{KEY}")')
   page.reload()
   page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
   page.evaluate('switchCourse("D756");navigate("mission");studyRealmSwitch("practice")')
  assert not errors,errors
  print(f"PASS all eight varied D756 scenarios and complete spoken answers at {width}px")
  ctx.close()
 browser.close()
