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
evidence_dir=Path(os.environ.get('RECOVERY_EVIDENCE','/tmp/aetheria-learning-evidence'))/'source-topics';evidence_dir.mkdir(parents=True,exist_ok=True)
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
  page.evaluate("switchCourse('D669');navigate('learninglab')")
  try:
   page.wait_for_function('Array.from(document.querySelector("#majPathLessonSelect")?.options||[]).some(o=>o.value==="topic:d669-s3-l3-1")')
  except Exception:
   print('CATALOG DIAGNOSTIC',width,page.evaluate('({course:S.activeCourse,selectors:[...document.querySelectorAll(".courseSelect")].map(e=>e.value),options:[...document.querySelectorAll("#majPathLessonSelect option")].map(e=>e.value)})'),flush=True);raise
  for topic in ['d669-s3-l2-review','d669-s3-l3-intro','d669-s3-l3-1','d669-s3-l3-2','d669-s3-l3-summary','d669-s3-l3-review','d669-s3-competency-self-check','d669-s4-intro','d669-s4-l1-intro']:
   page.locator('#majConnectedPath>details').evaluate('(e)=>e.open=true');select.select_option('topic:'+topic)
   panel=page.locator('#majConnectedPath .majPathEvidence').filter(has=page.locator('h3')).first
   data=page.evaluate('(id)=>{const c=MajickCourseSources.D669,sub=c.studySections.flatMap(s=>s.lessons||[]).flatMap(l=>l.sublessons||[l]).find(t=>t.id===id);return {title:sub.title,questions:c.questionBank.filter(q=>(sub.quizIds||[]).includes(q.id)&&(q.id.startsWith("d669-s3-supplied-20261126-")||q.id.startsWith("d669-s3-representation-20261126-")||q.id.startsWith("d669-s3-competency-20261126-")||q.id.startsWith("d669-s4-supplied-20261126-")))}}',topic)
   try:
    page.wait_for_function('(title)=>[...document.querySelectorAll("#majConnectedPath .majPathEvidence h3")].some(e=>e.textContent.replace(/[—–]/g,"-").includes(title.replace(/[—–]/g,"-")))',arg=data['title'])
   except Exception:
    print('TOPIC DIAGNOSTIC',width,topic,data['title'],page.locator('#majConnectedPath').inner_text()[:1800],flush=True);raise
   art=panel.locator('.majPathAnchor img');assert art.count()>0
   for img in art.all():
    img.scroll_into_view_if_needed();assert img.evaluate('async e=>{await e.decode();return e.naturalWidth>0&&e.alt===""&&e.parentElement.getAttribute("aria-hidden")==="true"}')
   if topic=='d669-s3-l3-1':
    assert art.count()==5 and 'Supplied correct choices (ungraded)' in panel.inner_text()
   if topic=='d669-s3-l3-2':
    assert art.count()==4 and panel.locator('iframe').count()==0
    video=panel.locator('a').filter(has_text='Mirrors, Windows and Sliding Glass Doors');assert video.get_attribute('href')=='https://www.youtube.com/watch?v=_AAu58SNSyc' and 'Reading Rockets' in video.inner_text()
    transcript=panel.locator('a[href*="936bf782"]');assert transcript.get_attribute('target')=='_blank' and 'transcript' in transcript.inner_text()
    panel.locator('details').first.locator('summary').click()
    notes=panel.inner_text();assert 'books by: 454 (14.2%); books about: 505 (15.8%)' in notes and 'books by: 4 (0.12%); books about: 6 (0.19%)' in notes
   if topic=='d669-s3-competency-self-check':
    assert 'Supplied model explanation (ungraded)' in panel.inner_text() and 'real-time feedback' in panel.inner_text()
   if topic in ['d669-s3-l3-2','d669-s4-l1-intro']:
    panel.locator('.majPathAnchor').screenshot(path=str(evidence_dir/f'{topic}-{width}.png'))
   for q in data['questions']:
    item=panel.locator('details').filter(has=page.get_by_text(q['prompt'],exact=True));item.locator('summary').click()
    item.get_by_role('button',name=q['answer'],exact=True).click();assert item.get_by_role('status').inner_text().startswith('Correct.')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),(width,topic)
  select.select_option('topic:d669-s3-l3-1')
  page.evaluate('render();render()')
  page.wait_for_selector('#majPathLessonSelect')
  assert select.input_value()=='topic:d669-s3-l3-1','Same-context redraw lost the selected source topic'
  assert page.locator('#majConnectedPath .majPathAnchor img').count()==5
  assert evidence()==before,'Supplied review/SEL topic practice must preserve academic evidence and balances'
  page.evaluate("S.courses.D669.userNotes='Preserved D669 course notes';switchCourse('D772');switchCourse('D669')")
  assert page.evaluate('S.courses.D669.userNotes')=='Preserved D669 course notes'
  assert not errors,errors
  print(f'PASS D669 {width}: 7 supplied documents, 7 registered packs, guided feedback, course notes and preserved XP/mastery with replay-safe existing fragment authority',flush=True)
  context.close()
 browser.close()
server.shutdown()
