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

 # Full reward boundaries for practice-only Arcade activities, including wrong
 # answers, corrected choices, replay, and course separation.
 context=browser.new_context(viewport={'width':1180,'height':1000},reduced_motion='reduce')
 page=context.new_page()
 page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'))
 page.wait_for_function('!!window.MajickRewardCore&&!!window.MajickFragmentEarnings&&!!window.startScholarInvestigation')
 snapshot="""()=>{const a=MajickStateCore.ensureAccount(),r=a.rewardCore;
 return {xp:a.xp,crystals:a.crystals,chests:a.chests,mastery:r.masteryXp,
 fragments:r.eggFragments,ledger:r.ledger}}"""
 for course in ['D669','D772','D755','D756']:
  page.evaluate("course=>{switchCourse(course);navigate('games')}",course)
  before=page.evaluate(snapshot)
  for attempt in range(2):
   page.evaluate('startScholarInvestigation()')
   for i in range(2):
    page.evaluate("()=>{inspectScholarClue(0);inspectScholarClue(1);inspectScholarClue(2)}")
    answer=page.evaluate('session.items[session.index][3]')
    choice=(answer+1)%3 if i==0 and attempt==0 else answer
    page.locator('[onclick="solveScholarCase('+str(choice)+')"]').click()
    page.locator('[onclick="nextScholarCase()"]').click()
   assert page.evaluate('session.finished')
   assert page.evaluate('session.score')==(1 if attempt==0 else 2)
   assert page.evaluate(snapshot)==before,(course,'investigation',attempt)
  print('PASS',course,'investigation wrong/correct/replay without account rewards',flush=True)
 page.evaluate("switchCourse('D669');navigate('games')")
 before=page.evaluate(snapshot)
 for attempt in range(2):
  page.evaluate('startCommunicationQuest()')
  for i in range(6):
   answer=page.evaluate('session.items[session.index][1]')
   choice=(answer+1)%3 if i==0 and attempt==0 else answer
   page.locator('[onclick="chooseCommunicationPortal('+str(choice)+')"]').click()
   page.locator('[onclick="nextCommunicationPortal()"]').click()
  assert page.evaluate('session.score')==(5 if attempt==0 else 6)
  assert page.evaluate(snapshot)==before,('communication',attempt)
 # Five Pillars Sort: fail first, qualify second, then replay after reload.
 key='fragment:game:D669:d669pillars'
 for attempt in range(3):
  if attempt==2:
   page.evaluate('MajickSaveSafety.flush()')
   page.reload(wait_until='domcontentloaded')
   page.wait_for_function('!!window.MajickRewardCore&&!!window.startD669PillarSort')
   page.evaluate("switchCourse('D669');navigate('games')")
  page.evaluate('startD669PillarSort()')
  count=page.evaluate('session.items.length')
  for i in range(count):
   page.evaluate("""good=>{
     const right=session.items[session.index].answer;
     const choices=[...document.querySelectorAll('.realmPillarChoices button')].map(b=>b.textContent);
     chooseD669Pillar(good?right:choices.find(c=>c!==right));nextD669Pillar();
   }""",attempt!=0)
  assert page.evaluate('session.finished')
  assert page.evaluate('session.score')==(0 if attempt==0 else count)
  state=page.evaluate(snapshot)
  if attempt==0:
   assert state==before,'failed pillar sort earned a reward'
  else:
   assert state['xp']==before['xp'] and state['crystals']==before['crystals'] and state['mastery']==before['mastery']
   assert state['fragments']==before['fragments']+1
   receipt=state['ledger'][key]['receipt']
   assert (receipt['xp'],receipt['crystals'],receipt['masteryXp'],receipt['eggFragments'])==(0,0,0,1)
   if attempt==1:
    earned=state
   else:
    assert state==earned,'pillar replay changed reward ledger'
 print('PASS communication and Five Pillars failure, first clear and persisted replay',flush=True)
 context.close()
 browser.close()
server.shutdown()
