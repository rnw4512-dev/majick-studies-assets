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

 # Workshop games deliberately award journal memories, not currency. Use
 # public content pools to select answers through the real workshop buttons.
 page.evaluate("switchCourse('D669');navigate('games')")
 workshop=page.locator('#aethCourseGames')
 workshop.wait_for()
 workshop.locator('[data-exp-section="2"]').click()
 before=page.evaluate(snapshot)
 def button(selector):
  return workshop.locator(selector).first
 def choose_label(selector,label):
  choice=workshop.locator(selector).filter(has_text=label)
  # Match the data attribute exactly, not a substring of a related option.
  choice=workshop.locator(selector).evaluate_all("(buttons,label)=>buttons.find(b=>Object.values(b.dataset).includes(label))?.dataset",label)
  assert choice is not None,(selector,label)
  attr=next(k for k,v in choice.items() if v==label)
  css='data-'+''.join('-'+c.lower() if c.isupper() else c for c in attr)
  workshop.locator(f'[{css}]').evaluate_all("(buttons,label)=>buttons.find(b=>Object.values(b.dataset).includes(label)).click()",label)
 for mode in ['sort','match','classroom']:
  for attempt in range(2):
   rows=page.evaluate("mode=>MajickLearningExperiences.courseGames('D669',mode)",mode)
   assert len(rows)>=3
   button(f'[data-exp-mode="{mode}"]').click()
   for i,row in enumerate(rows):
    answer=row['correct']
    if i==0 and attempt==0:
     button(f'[data-exp-answer="{(answer+1)%len(row["options"])}"]').click()
     button('[data-exp-retry]').click()
    button(f'[data-exp-answer="{answer}"]').click()
    button('[data-exp-next]').click()
   assert workshop.locator('.aeth-mini-result').count()==1
   assert page.evaluate(snapshot)==before,(mode,attempt)
   memories=page.evaluate("mode=>MajickLearningExperiences.memories().filter(m=>m.key==='game:D669:'+mode)",mode)
   assert len(memories)==1
  button('[data-exp-exit]').click()
 for mode in ['forge','sequence','scenario']:
  for attempt in range(2):
   rows=page.evaluate("mode=>{const e=MajickLearningExperiences,p=e.deepPool('D669',mode),n=Math.min(4,p.length),cycle=e.exportState().playRuns?.['D669:'+mode]||0;return Array.from({length:n},(_,i)=>p[(cycle*n+i)%p.length])}",mode)
   assert len(rows)>=3
   button(f'[data-deep-mode="{mode}"]').click()
   for i,row in enumerate(rows):
    if mode=='scenario':
     answer=row['correct']
     if i==0 and attempt==0:
      button(f'[data-deep-tile="{(answer+1)%len(row["options"])}"]').click()
      button('[data-deep-retry]').click()
     button(f'[data-deep-tile="{answer}"]').click()
    else:
     parts=row['parts']
     if i==0 and attempt==0:
      for index in reversed(range(len(parts))):
       button(f'[data-deep-tile="{index}"]').click()
      button('[data-deep-check]').click()
      button('[data-deep-retry]').click()
     for index in range(len(parts)):
      button(f'[data-deep-tile="{index}"]').click()
     button('[data-deep-check]').click()
    button('[data-deep-next]').click()
   assert workshop.locator('[aria-label="Completed interactive game"]').count()==1
   assert page.evaluate(snapshot)==before,(mode,attempt)
   assert page.evaluate("mode=>MajickLearningExperiences.memories().filter(m=>m.key==='deep:D669:'+mode).length",mode)==1
  button('[data-exp-exit]').click()
 for mode,method in [('vocab','vocabQuestions'),('comp','comprehensionQuestions')]:
  rows=page.evaluate("method=>MajickLearningExperiences[method]()",method)
  assert len(rows)==(7 if mode=='vocab' else 8)
  for attempt in range(2):
   button(f'[data-{mode}-start]').click()
   for i,row in enumerate(rows):
    selector=f'[data-{mode}-choice]'
    if i==0 and attempt==0:
     labels=workshop.locator(selector).evaluate_all("(buttons,mode)=>buttons.map(b=>b.dataset[mode+'Choice'])",mode)
     choose_label(selector,next(label for label in labels if label!=row['answer']))
     button(f'[data-{mode}-retry]').click()
    choose_label(selector,row['answer'])
    button(f'[data-{mode}-next]').click()
   assert page.evaluate(snapshot)==before,(mode,attempt)
   memory='deep:D669:vocabulary-3-8' if mode=='vocab' else 'deep:D669:comprehension-3-9'
   assert page.evaluate("key=>MajickLearningExperiences.memories().filter(m=>m.key===key).length",memory)==1
  button('[data-exp-exit]').click()
 print('PASS all eight D669 workshop activities: wrong, repair, correct, replay, journal uniqueness and no currency or mastery',flush=True)
 context.close()
 browser.close()
server.shutdown()
