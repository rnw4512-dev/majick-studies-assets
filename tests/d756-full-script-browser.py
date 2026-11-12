"""D756 full speakable 12-part script: usable in guided mode, never independent credit."""
import os
from playwright.sync_api import sync_playwright
URL=os.environ.get('MAJICK_URL','http://127.0.0.1:8765/')
KEY='majick-d756-task2-rehearsal-v1'
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/google-chrome'),args=['--no-sandbox'])
 for width in (390,820,1366):
  ctx=browser.new_context(viewport={'width':width,'height':850})
  page=ctx.new_page()
  errors=[]
  page.on('pageerror',lambda err: errors.append(str(err)))
  page.goto(URL)
  page.wait_for_function('!!window.MajickD756Meeting && !!window.MajickRewardCore')
  page.evaluate('switchCourse("D756");MajickD756Meeting.openScenario("standard")')
  room=page.locator('#d756MeetingRoom')
  room.locator('#dmMode').select_option('guided')
  room.locator('[data-action=start]').click()
  script=room.locator('.dmFullScript')
  assert script.count()==1
  assert 'Good afternoon' in script.locator('blockquote').inner_text()
  assert 'introduce ourselves' in script.locator('blockquote').inner_text().lower()
  assert script.locator('li').count()==12
  assert room.locator('.dmFullScript').evaluate('(el)=>el.compareDocumentPosition(document.querySelector(".dmChoices")) & Node.DOCUMENT_POSITION_FOLLOWING')!=0
  initial=page.evaluate('({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})')
  script.locator('[data-action=use-full-script]').click()
  response=room.locator('#dmAnswer').input_value()
  assert len(response.split())>85,response
  assert page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).assistedStage') is True
  room.locator('[data-action=submit]').click()
  rec=page.evaluate(f'JSON.parse(localStorage.getItem("{KEY}")).records.slice(-1)[0]')
  assert rec['assisted'] is True
  assert rec['answer'].startswith('Good afternoon')
  after=page.evaluate('({xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})')
  assert initial==after,(initial,after)
  room.locator('[data-action=close]').click()
  # The original Independent rehearsal hides any prepared teacher script.
  page.evaluate(f'localStorage.removeItem("{KEY}")')
  page.reload()
  page.wait_for_function('!!window.MajickD756Meeting')
  page.evaluate('switchCourse("D756");MajickD756Meeting.openScenario("standard","angela","independent")')
  room=page.locator('#d756MeetingRoom')
  room.locator('[data-action=start]').click()
  assert room.locator('.dmFullScript').count()==0
  assert room.locator('[data-action=use-full-script]').count()==0
  assert not errors,errors
  print(f'PASS complete teacher script, assisted provenance, no duplicate rewards and independent-mode isolation: {width}px')
  ctx.close()
 browser.close()
