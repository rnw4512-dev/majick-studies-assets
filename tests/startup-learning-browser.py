"""Exercise startup isolation and the existing Your Turn learning owner."""
import json,os,sys,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/')
out=Path(os.environ.get('LEARNING_EVIDENCE','/tmp/aetheria-learning-evidence'));out.mkdir(parents=True,exist_ok=True)
def mount(page):
 page.evaluate('''()=>{S.activeCourse='D772';const host=document.createElement('section');host.id='learning-regression';document.querySelector('#content').replaceChildren(host);MajickYourTurn.mount(host,{id:'d772-s2-l4',title:'Descriptive Statistics'},'D772')}''')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  ctx=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=ctx.new_page();errors=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url))
  page.goto(url);page.wait_for_function('!!window.MajickYourTurn && !!window.MajickLearningContinuity');page.wait_for_timeout(600)
  assert page.locator('.nav button').count()>5
  assert page.locator('iframe').count()==0,'Home initialized an unrelated room'
  assert not any('/pixi-sanctuary/' in r or '/vendor/pixi-' in r or 'objects-manifest.json' in r for r in requests)
  room_names=['guardian-dorm-v1','ancient-study-library-v1','learn-classroom-v1','learn-classroom-v2','game-observatory-v1']
  assert not any(any(name+'.png' in r for name in room_names) for r in requests),'Unoptimized room background fetched'
  assert any(('-820.webp' if width<=820 else 'ancient-study-library-v1.webp') in r for r in requests),'Responsive room background missing'
  # One real authoritative receipt, replay-safe and static under reduced motion.
  page.evaluate("MajickRewardCore.award('correct-answer',{key:'browser-regression:xp',course:'D772',independent:false})")
  assert page.locator('#majRewardReceipt').get_attribute('role')=='status'
  assert page.locator('#majRewardReceipt .majRewardCard').evaluate('(el)=>getComputedStyle(el).animationName')=='none'
  earned=page.evaluate('MajickStateCore.ensureAccount().xp')
  page.evaluate("MajickRewardCore.award('correct-answer',{key:'browser-regression:xp',course:'D772',independent:false})")
  assert page.evaluate('MajickStateCore.ensureAccount().xp')==earned
  mount(page);panel=page.locator('.mjtYourTurn');page.wait_for_timeout(200)
  panel.locator('[data-number]').fill('12');panel.locator('[data-check]').click()
  assert panel.locator('.mjtFeedback').get_attribute('data-status')=='correct'
  xp=page.evaluate('S.progress.D772.xp');successes=page.evaluate("S.progress.D772.learningNeeds['d772-s2-l4'].successes")
  panel.locator('[data-check]').click();assert page.evaluate('S.progress.D772.xp')==xp
  assert page.evaluate("S.progress.D772.learningNeeds['d772-s2-l4'].successes")==successes
  page.evaluate("window.staleCheck=document.querySelector('.mjtYourTurn [data-check]').onclick")
  panel.locator('[data-next]').click();assert 'median' in panel.locator('.mjtQuestion').inner_text()
  assert panel.locator('[data-number]').input_value()=='';assert panel.locator('.mjtFeedback').count()==0
  page.evaluate('staleCheck()');assert panel.locator('.mjtFeedback').count()==0
  panel.locator('[data-number]').fill('9');panel.locator('[data-check]').click()
  assert panel.locator('.mjtFeedback').get_attribute('data-status')=='incorrect'
  assert 'Incorrect' in panel.locator('.mjtFeedback > summary').inner_text()
  assert '8' in panel.locator('.mjtFeedbackBody').inner_text()
  panel.locator('.mjtFeedback > summary').focus();page.keyboard.press('Enter');assert panel.locator('.mjtFeedback').get_attribute('open') is None
  panel.locator('.mjtFeedback > summary').click();assert panel.locator('[data-number]').input_value()=='9'
  panel.locator('[data-number]').fill('10');assert panel.locator('.mjtFeedback').count()==0
  panel.locator('[data-check]').click();assert panel.locator('.mjtFeedback').get_attribute('data-status')=='correct'
  panel.locator('[data-next]').click();panel.locator('[data-number]').fill('15.6')
  page.reload();page.wait_for_function('!!window.MajickYourTurn');mount(page)
  assert 'fifth score' in panel.locator('.mjtQuestion').inner_text()
  assert panel.locator('[data-number]').input_value()=='15.6'
  panel.locator('[data-q="0"]').click();assert panel.locator('[data-number]').input_value()=='12'
  assert panel.locator('.mjtFeedback').get_attribute('data-status')=='correct'
  assert '✓' in panel.locator('[data-q="0"]').inner_text()
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),f'Overflow at {width}'
  def vocabulary():
   page.evaluate('''()=>{const outer=document.createElement('section');outer.id='learnInlinePractice';document.querySelector('#content').append(outer);MajickInlineLessonPractice.mount(null,{id:'vocabulary-regression',title:'Mean and median',explain:'The mean is the sum of the scores divided by their count.'},0)}''')
  vocabulary();vocab=page.locator('.mliVocabularyPanel');vocab.locator('[data-term="0"]').click();vocab.locator('[data-definition="0"]').click()
  assert vocab.locator('[data-term="0"]').is_disabled()
  page.reload();page.wait_for_function('!!window.MajickInlineLessonPractice');mount(page);vocabulary()
  assert vocab.locator('[data-term="0"]').is_disabled(),'Vocabulary draft lost on reload'
  # Complete a real reconstruction through the existing evaluation pipeline.
  page.evaluate('''()=>{const c=MajickLearningContinuity,trio=MajickD772SharedQuestions.practiceQuestions().filter(q=>q.skill==='weighted-mean'),q=trio[0];c.practiceAnswer(q,false,false,'wrong');c.practiceAnswer(q,false,false,'wrong',{attemptId:'journal-second-miss'});for(const step of MajickSolutionEngine.reconstructionPlan(q)){const values=step.regions?step.regions.map(r=>r.selected):step.fields?step.fields.map(f=>String(f.value)):[step.answer];if(!c.reconstructionCheck(q,values).ok)throw Error('Repair failed')}window.journalTransfer=trio[1]}''')
  # The existing Journal reads the activity owner; tabs never copy progress.
  page.evaluate("navigate('journal')")
  journal=page.locator('#masScholarJournal');assert journal.count()==1
  guided=page.evaluate('Object.values(S.progress.D772.yourTurnPractice).reduce((n,l)=>n+Object.values(l.completed).filter(Boolean).length,0)')
  assert f'{guided} completed questions with support' in journal.inner_text()
  page.screenshot(path=str(out/f'journal-{width}.png'),full_page=False)
  before=page.evaluate('JSON.stringify({answers:S.progress.D772.answers,practice:S.progress.D772.yourTurnPractice,skills:S.progress.D772.adaptiveSkills})')
  journal.locator('[data-journal-tab=achievements]').focus();page.keyboard.press('ArrowRight')
  assert journal.locator('[data-journal-tab=recent]').get_attribute('aria-selected')=='true'
  assert 'Descriptive Statistics' in journal.locator('[data-journal-page=recent]').inner_text()
  journal.locator('[data-journal-tab=repairs]').click()
  assert 'Guided reconstruction completed' in journal.locator('[data-journal-page=repairs]').inner_text()
  assert 'Fresh independent transfer still needed' in journal.locator('[data-journal-page=repairs]').inner_text()
  journal.locator('[data-journal-tab=notes]').click();journal.locator('#masJournalText').fill('Saved reflection stays while changing tabs.')
  journal.locator('[data-journal-tab=repairs]').click();journal.locator('[data-journal-tab=notes]').click()
  assert journal.locator('#masJournalText').input_value()=='Saved reflection stays while changing tabs.'
  journal.get_by_role('button',name='Save Entry',exact=True).click()
  assert 'Saved reflection stays while changing tabs.' in journal.locator('.masJournalNotes').inner_text()
  assert page.evaluate('JSON.stringify({answers:S.progress.D772.answers,practice:S.progress.D772.yourTurnPractice,skills:S.progress.D772.adaptiveSkills})')==before
  page.evaluate("MajickLearningContinuity.practiceAnswer(journalTransfer,true,false,journalTransfer.answer);render()")
  journal.locator('[data-journal-tab=repairs]').click()
  assert 'Fresh independent transfer verified' in journal.locator('[data-journal-page=repairs]').inner_text()
  journal.locator('[data-journal-tab=recent]').click();journal.locator('[data-journal-page=recent] [data-journal-resume]').first.click()
  page.wait_for_function("S.screen==='learninglab' && MajickCourseTutor.selectedLesson('D772')?.id==='d772-s2-l4'")
  assert not errors,errors
  print(f'PASS {width}: Home has no hidden scene; Q1→Q2, stale handler, correct/incorrect feedback, keyboard collapse, completion/XP replay and reload/draft persistence; Journal source sync, keyboard tabs, notes and lesson resume',flush=True)
  ctx.close()
 browser.close()
server.shutdown()
