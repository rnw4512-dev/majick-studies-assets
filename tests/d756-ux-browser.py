"""D756 user-facing regression: reference access, clock options, sample replies, study routing, quiz and rewards.
Uses isolated browser contexts, never a real learner's saved data.
"""
import os
from playwright.sync_api import sync_playwright
URL=os.environ.get("MAJICK_URL","http://127.0.0.1:8765/")
KEY="majick-d756-task2-rehearsal-v1"
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/google-chrome"),args=["--no-sandbox"])
 for width in [390,820,1366]:
  ctx=browser.new_context(viewport={"width":width,"height":850})
  page=ctx.new_page()
  js_errors=[]
  page.on("pageerror",lambda error:js_errors.append(str(error)))
  page.goto(URL)
  page.wait_for_function("!!window.MajickD756Meeting && !!window.MajickRewardCore")
  page.evaluate('switchCourse("D756")')
  page.evaluate('navigate("mission")')
  assert page.get_by_text("IEP reference and three measurable goals").count()>0, "D756 Study Realm should not be a blank skill library"
  page.evaluate('navigate("test")')
  assert page.get_by_text("Task 2 · IEP Meeting Simulation").count()>0, "D756 needs a performance-based assessment route"
  page.evaluate('MajickD756Meeting.open()')
  room=page.locator("#d756MeetingRoom")
  assert room.locator("#dmStoryline").count()==1
  assert room.locator("#dmPacing").count()==1
  room.locator("#dmStoryline").select_option("classroom-writing")
  room.locator("#dmMode").select_option("guided")
  room.locator("#dmPacing").select_option("typing")
  initial=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  room.locator("[data-action=start]").click()
  assert room.locator(".dmReference .dmGlance").count()==1
  assert room.locator(".dmReference [data-goal]").count()==3
  assert room.locator(".dmChoiceList button").count()==3
  assert room.locator("[data-action=dictate]").count()==1
  box=room.locator("#dmAnswer")
  box.focus()
  assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).pacing')=="typing"
  assert page.evaluate('document.querySelector("#d756MeetingRoom .dmPanel").getBoundingClientRect().top >= 0')
  # The close action remains onscreen even when the conversation scrolls to the bottom.
  room.locator(".dmBody").evaluate("(el)=>el.scrollTop=el.scrollHeight")
  close=room.locator('[data-action=close]')
  assert close.is_visible()
  assert close.evaluate("(el)=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight}"),"Close button escaped viewport"
  room.locator("[data-response-choice='0']").click()
  assert len(box.input_value())>35
  assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).assistedStage') is True
  room.locator("[data-action=submit]").click()
  attempt=page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}"))')
  assert attempt["records"][-1]["assisted"] is True
  assert "independent" not in (attempt.get("reward") or {}).get("status",""),"A modeled answer must not be treated as independent"
  end=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  assert initial==end, "Opening and choosing a sample must not award XP"
  room.locator("[data-action=close]").click()
  page.evaluate('MajickD756Meeting.openKnowledgeCheck()')
  quiz=page.locator("#d756QuickCheck")
  assert quiz.count()==1
  expected=[1,2,0,1,2,0]
  for i,answer in enumerate(expected):
   quiz.locator(f'[data-kanswer="{answer}"]').click()
   assert quiz.locator(".dmCheckFeedback").count()==1
   assert "Best response:" in quiz.inner_text()
   quiz.locator("[data-knext]").click()
  assert "6 / 6" in quiz.inner_text()
  end=page.evaluate("({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})")
  assert initial==end, "Knowledge check is coaching, not a second XP system"
  quiz.locator("[data-kclose]").click()
  assert quiz.count()==0
  assert not js_errors,js_errors
  print(f"PASS D756 course study, responsive Council UX, knowledge check, no duplicate reward, {width}px")
  ctx.close()
 browser.close()
