"""Real communication, investigation, constellation and Oracle interactions at each viewport."""
import os,sys,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve();server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=context.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'));page.wait_for_function('!!window.MajickAetheriaAdventures&&!!window.startCommunicationQuest')
  page.evaluate("switchCourse('D669');navigate('games')")
  assert page.locator('[onclick="startCommunicationQuest()"]').count()>0
  page.locator('[onclick="startCommunicationQuest()"]').first.click()
  before=page.evaluate('JSON.stringify({xp:MajickStateCore.ensureAccount().xp,skills:S.progress.D669.adaptiveSkills})')
  for i in range(6):
   answer=page.evaluate('session.items[session.index][1]')
   page.locator('[onclick="chooseCommunicationPortal('+str(answer)+')"]').click()
   page.locator('[onclick="nextCommunicationPortal()"]').click()
  assert 'Communication Quest complete' in page.locator('#content').inner_text()
  assert page.evaluate('session.score')==6
  page.evaluate('startScholarInvestigation()')
  for i in range(2):
   # Decisions cannot appear before all evidence has been inspected.
   assert page.locator('[onclick^="solveScholarCase("]').count()==0
   for clue in range(3):page.locator('[onclick="inspectScholarClue('+str(clue)+')"]').click()
   answer=page.evaluate('session.items[session.index][3]')
   page.locator('[onclick="solveScholarCase('+str(answer)+')"]').click()
   page.locator('[onclick="nextScholarCase()"]').click()
  assert 'Cases solved: 2/2' in page.locator('#content').inner_text()
  assert page.evaluate('JSON.stringify({xp:MajickStateCore.ensureAccount().xp,skills:S.progress.D669.adaptiveSkills})')==before,'Guided games changed XP or mastery'
  page.evaluate('startMemoryConstellation()')
  pair=page.evaluate('()=>{const i=session.cards.findIndex(c=>c.kind==="clue");return [i,session.cards.findIndex(c=>c.kind==="answer"&&c.pair===session.cards[i].pair)]}')
  for card in pair:page.locator('[data-card-index="'+str(card)+'"]').click()
  page.wait_for_function('session.matched>0')
  page.evaluate("switchCourse('D772');startOracleLens()")
  lens=page.evaluate('session.correctLens');page.locator('[data-lens]').filter(has_text=lens).first.click()
  answer=page.evaluate('session.current.answer')
  page.locator('.realmOracle [data-answer]').filter(has_text=answer).first.click()
  assert page.locator('.realmOracleFeedback').count()==1
  assert page.evaluate('session.answered')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
  assert not errors,errors
  print(f'PASS interactions {width}: 6 communication decisions, 2 evidence-gated investigations, constellation pair, Oracle lens/answer, guided boundaries and no console errors',flush=True)
  context.close()
 browser.close()
server.shutdown()
