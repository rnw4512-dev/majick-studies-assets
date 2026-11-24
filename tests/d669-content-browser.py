"""Every supplied D669 document and registered practice pack stays reachable without rewards."""
import os,sys,threading
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
url=os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':1000},reduced_motion='reduce');page=context.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(url);page.wait_for_function('!!window.MajickCourseSources?.documents?.D669 && !!window.MajickCourseLearningPath')
  page.evaluate("switchCourse('D669');navigate('learninglab')")
  select=page.locator('#majPathLessonSelect');select.wait_for(state='attached')
  page.locator('#majConnectedPath>details').evaluate('(e)=>e.open=true')
  docs=page.evaluate('MajickCourseSources.documents.D669');packs=page.evaluate("Object.values(MajickCourseActivityPlayer.packs).filter(p=>p.courseId==='D669').map(p=>p.id)")
  assert len(docs)==7 and len(packs)==7,(len(docs),packs)
  values=select.locator('option').evaluate_all('(rows)=>rows.map(r=>r.value)')
  assert all('document:'+d['id'] in values for d in docs)
  assert all('pack:'+p in values for p in packs),'D669 early return hid registered practice packs'
  def evidence():
   return page.evaluate('JSON.stringify({courses:Object.fromEntries(Object.entries(S.progress).map(([id,p])=>[id,{answers:p.answers,skills:p.adaptiveSkills,mastery:p.mastery,needs:p.learningNeeds}])),xp:MajickStateCore.ensureAccount().xp,crystals:MajickStateCore.ensureAccount().crystals})')
  before=evidence()
  for doc in docs:
   select.select_option('document:'+doc['id'])
   panel=page.locator('[data-source-document="'+doc['id']+'"]')
   page.wait_for_function('(title)=>[...document.querySelectorAll("[data-source-document] h3")].some(h=>h.textContent.replace(/[–—]/g,"-")===title.replace(/[–—]/g,"-"))',arg=doc['title'])
   assert 'not independent mastery evidence' in panel.inner_text()
   assert panel.locator('details').count()>0
   panel.locator('summary').first.click()
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),(width,doc['id'])
  assert evidence()==before,'Reading references must not change academic evidence or balances'
  for pack in packs:
   select.select_option('pack:'+pack)
   page.get_by_role('button',name='Open current topic',exact=True).click()
   panel=page.locator('[data-cap-pack="'+pack+'"]')
   page.wait_for_function('(id)=>document.querySelector(`[data-cap-pack="${id}"]`)?.open',arg=pack)
   activity=panel.locator('[data-cap-activity]').first
   answer=page.evaluate('(id)=>Object.values(MajickCourseActivityPlayer.packs).find(p=>p.id===id).activities[0].correct',pack)
   activity.locator('[data-cap-answer="'+str(answer)+'"]').click()
   assert activity.locator('.cap-feedback').get_attribute('data-result')=='correct'
   fragments=page.evaluate('MajickFragmentEarnings.balance()')
   activity.locator('[data-cap-answer="'+str(answer)+'"]').click()
   assert page.evaluate('MajickFragmentEarnings.balance()')==fragments,'Replaying a source answer must not duplicate fragments'
   page.locator('#majConnectedPath>details').evaluate('(e)=>e.open=true')
  assert evidence()==before,'Guided source checks must preserve academic evidence, XP and crystals'
  page.evaluate("S.courses.D669.userNotes='Preserved D669 course notes';switchCourse('D772');switchCourse('D669')")
  assert page.evaluate('S.courses.D669.userNotes')=='Preserved D669 course notes'
  assert not errors,errors
  print(f'PASS D669 {width}: 7 supplied documents, 7 registered packs, guided feedback, course notes and preserved XP/mastery with replay-safe existing fragment authority',flush=True)
  context.close()
 browser.close()
server.shutdown()
