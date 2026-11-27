"""Same-skill variety, the reported D669 crash, and real guided-practice backup/reload."""
import json,os,sys,threading,re
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve();server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
def luminance(rgb):
 v=[x/255 for x in rgb];v=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v];return sum(x*w for x,w in zip(v,[.2126,.7152,.0722]))
def ink(locator):
 for el in locator.all():
  if not el.is_visible() or not el.inner_text().strip():continue
  color=el.evaluate('(e)=>getComputedStyle(e).webkitTextFillColor');rgb=list(map(float,re.findall(r'[\d.]+',color)[:3]));fg=luminance(rgb)
  for paper in [[255,253,250],[243,239,250],[249,245,250]]:
   bg=luminance(paper);assert (max(fg,bg)+.05)/(min(fg,bg)+.05)>=4.5,(el.inner_text()[:80],color)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000},accept_downloads=True,reduced_motion='reduce');page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'));page.wait_for_function('!!window.MajickLearningExperiences&&!!window.MajickStudyObservatory&&!!window.MajickGameRealm')
  page.evaluate("switchCourse('D669');navigate('games')")
  protected=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
  pool=page.evaluate("MajickLearningExperiences.sectionQuestions('D669',1)");assert len(pool)>5
  page.locator('[data-exp-mode="sort"]').first.click();first=page.locator('.aeth-mini-stage h3').inner_text()
  for index in range(5):
   prompt=page.locator('.aeth-mini-stage h3').inner_text();q=next(q for q in pool if prompt.endswith(q['prompt']))
   if index==0:
    page.locator(f'[data-exp-answer="{(q["correct"]+1)%len(q["options"])}"]').click();ink(page.locator('.aeth-mini-coach :is(p,b)'));page.locator('[data-exp-retry]').click();assert page.locator('.aeth-mini-stage h3').inner_text()==prompt
   page.locator(f'[data-exp-answer="{q["correct"]}"]').click();ink(page.locator('.aeth-mini-stage h3,.aeth-mini-coach :is(p,b)'));page.locator('[data-exp-next]').click()
  assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==protected,'Guided counters changed reward/mastery state'
  stats=page.evaluate("MajickStudyObservatory.summary('D669')");assert stats['guidedAttempts']==6 and stats['allPracticeCount']==6 and stats['allPracticeUniqueCorrect']==5,stats
  assert stats['uniqueCorrect']==0 and stats['tickets']==0,'Guided games create sourced credit/passes'
  assert stats['savedDiscoveries']>=1
  page.evaluate('window.MajickSaveSafety?.flush?.()');page.reload();page.wait_for_function('!!window.MajickLearningExperiences&&!!window.MajickStudyObservatory');page.evaluate("switchCourse('D669');navigate('games')")
  assert page.evaluate("MajickStudyObservatory.summary('D669').guidedAttempts")==6
  page.locator('[data-exp-mode="sort"]').first.click();second=page.locator('.aeth-mini-stage h3').inner_text();assert second!=first,'Every round reuses the first question'
  assert any(second.endswith(q['prompt']) for q in pool),'Rotation left the selected section/skill pool'
  page.evaluate("const q=S.courses.D669.questionBank[0];S.progress.D669.answers.push({qid:q.id,topicId:q.topicId,correct:true,assisted:true});save();navigate('learninglab')")
  assert page.evaluate("MajickStudyObservatory.summary('D669').allPracticeCount")==7,'Existing saved course answers are omitted'
  with page.expect_download() as event:page.locator('[data-obs-backup]').click()
  payload=json.loads(Path(event.value.path()).read_text());assert all(k in payload['browserData'] for k in ['majick-learning-observatory-v1','aetheria-experiences-v1','aetheria-adventure-journal-v1'])
  page.evaluate("navigate('games')");page.locator('[data-exp-mode="sort"]').first.click();prompt=page.locator('.aeth-mini-stage h3').inner_text();q=next(q for q in pool if prompt.endswith(q['prompt']));page.locator(f'[data-exp-answer="{q["correct"]}"]').click();assert page.evaluate("MajickStudyObservatory.summary('D669').guidedAttempts")==7
  page.on('dialog',lambda d:d.accept());page.evaluate("navigate('control')");page.locator('.v338SavePanel input[type=file]').set_input_files({'name':'study-backup.json','mimeType':'application/json','buffer':json.dumps(payload).encode()});page.wait_for_timeout(100)
  assert page.evaluate("MajickStudyObservatory.summary('D669').guidedAttempts")==6,'Imported storage does not refresh its active owner'
  page.evaluate('window.MajickSaveSafety?.flush?.()');page.reload();page.wait_for_function('!!window.MajickStudyObservatory&&!!window.MajickGameRealm');assert page.evaluate("MajickStudyObservatory.summary('D669').allPracticeCount")==7
  result=page.evaluate("""()=>{switchCourse('D669');session=null;S.progress.D669.answers=[];const pool=MajickGameRealm.realmQuestionPool().filter(q=>q.rotationSkill==='d669-realm-sounds');const picked=[];for(let i=0;i<pool.length;i++){const q=pickAdaptive(pool);if(!q)throw Error('No same-skill example');picked.push({id:q.id,skill:q.rotationSkill,prompt:q.prompt});S.progress.D669.answers.push({qid:q.id,topicId:q.topicId,correct:true,assisted:true})}return picked}""")
  assert len(result)==3 and len({q['id'] for q in result})==3 and all(q['skill']=='d669-realm-sounds' for q in result),result
  page.evaluate("navigate('games');startGuardianGauntlet()")
  page.locator('.realmGauntlet .question').wait_for(state='visible');assert page.evaluate('!!session.current&&MajickGameRealm.realmQuestionPool().some(q=>q.id===session.current.id)')
  page.evaluate('session.current=null;render()');assert page.get_by_role('heading',name='Practice questions are not available yet',exact=True).is_visible()
  # Complete every workshop mode in each section without awarding mastery or currency.
  page.evaluate("navigate('games')")
  for section in [1,2,3]:
   page.locator(f'[data-exp-section="{section}"]').click()
   for mode in ['sort','match','classroom','forge','sequence','scenario']:
    basic=mode in ['sort','match','classroom']
    attr='exp' if basic else 'deep'
    button=page.locator(f'[data-{attr}-mode="{mode}"]').first
    assert button.is_enabled(),(width,section,mode)
    protected_game=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
    rows=page.evaluate("(mode)=>MajickLearningExperiences."+("courseGames" if basic else "deepPool")+"('D669',mode)",mode)
    button.click()
    stage=page.locator('.aeth-mini-stage' if basic else '.aeth-deep-stage')
    for _ in range(5):
     if basic and page.locator('.aeth-mini-result').count():break
     if not basic and stage.get_attribute('role')=='status':break
     if basic:
      prompt=stage.locator('h3').inner_text()
      # Matching and sorting rotate through the same underlying section bank.
      candidates=page.evaluate("(mode)=>MajickLearningExperiences.courseGames('D669',mode)",mode)
      q=next((q for q in rows+candidates if q['prompt']==prompt),None)
      assert q is not None,(mode,prompt)
      options=stage.locator('[data-exp-answer]').all_inner_texts()
      # Match by answer text because the concept subset can rotate.
      answer=q['options'][q['correct']]
      idx=next(i for i,t in enumerate(options) if t.strip().endswith(answer))
      stage.locator(f'[data-exp-answer="{idx}"]').click()
      stage.locator('[data-exp-next]').click()
     elif mode=='scenario':
      prompt=stage.locator(':scope > p').first.inner_text()
      q=next(q for q in rows if q['prompt']==prompt)
      stage.locator(f'[data-deep-tile="{q["correct"]}"]').click()
      stage.locator('[data-deep-next]').click()
     else:
      prompt=stage.locator('h3').inner_text()
      q=next(q for q in rows if q.get('clue',q.get('title'))==prompt)
      for i in range(len(q['parts'])):stage.locator(f'[data-deep-tile="{i}"]').click()
      stage.locator('[data-deep-check]').click()
      stage.locator('[data-deep-next]').click()
    assert page.locator('.aeth-mini-result' if basic else '.aeth-deep-stage[role="status"]').is_visible(),(section,mode)
    assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==protected_game
  # Verify the compact workshop navigation using actual browser controls.
  page.locator('[data-exp-section="3"]').click()
  outline=page.locator('#aethCourseGames details.aeth-section-outline').first
  assert outline.get_attribute('open') is None
  outline.locator(':scope > summary').click()
  assert outline.get_attribute('open') is not None
  assert outline.locator('.aeth-section-lessons').evaluate("(el)=>getComputedStyle(el).overflowY")=='visible'
  outline.locator(':scope > summary').click()
  help_panel=page.locator('#aethCourseGames details').filter(has=page.get_by_text('How to play the six games',exact=True))
  help_panel.locator(':scope > summary').click()
  assert help_panel.get_attribute('open') is not None
  before_exit=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
  for mode in ['sort','forge']:
   attr='exp' if mode=='sort' else 'deep'
   page.locator(f'[data-{attr}-mode="{mode}"]').first.click()
   page.locator('[data-exp-exit]').click()
   assert not page.locator('#aethCourseGames .aeth-mini-stage,#aethCourseGames .aeth-deep-stage').count()
   assert page.locator('[data-exp-section="3"]').get_attribute('aria-pressed')=='true'
   assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==before_exit
  print('PASS',width,'collapsible lesson notes, no nested scrollbar, instructions and safe game exit',flush=True)
  assert not errors,errors
  print('PASS',width,'same-skill fresh cases, nonrepeating course rounds, readable feedback, saved game/answer counts, backup/import/reload and safe Gauntlet',flush=True);context.close()
 browser.close()
server.shutdown()
