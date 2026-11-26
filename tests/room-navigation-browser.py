"""Smoke real navigation and listener ownership at the required viewport sizes."""
import os,sys,threading,json
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
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for width in [390,820,1366]:
  ctx=browser.new_context(ignore_https_errors=os.environ.get('BROWSER_IGNORE_HTTPS_ERRORS')=='1',viewport={'width':width,'height':1000});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(url);page.wait_for_function('!!window.MajickYourTurn && !!window.MajickUniversalHandsOn');page.wait_for_timeout(600)
  routes=page.locator('.nav [data-nav]').evaluate_all('(buttons)=>[...new Set(buttons.map(b=>b.dataset.nav))]')
  for route in routes:
   button=page.locator(f'.nav [data-nav="{route}"]').first
   if button.count():button.click()
   else:page.evaluate('(route)=>navigate(route)',route)
   page.wait_for_timeout(180)
   assert page.evaluate('S.screen')==route,(width,route,page.evaluate('S.screen'))
   if route!='control':
    icon=page.locator(f'.nav [data-nav=\"{route}\"]>span:first-child').first
    page.wait_for_function('(route)=>[...document.querySelectorAll(".nav button[data-nav]")].find(e=>e.dataset.nav===route)?.firstElementChild?.getAttribute("aria-hidden")==="true"',arg=route)
    art=icon.evaluate('async e=>{const image=getComputedStyle(e).backgroundImage,img=new Image();img.src=image.slice(5,-2);await img.decode();return {image,font:getComputedStyle(e).fontSize,hidden:e.getAttribute("aria-hidden"),loaded:img.naturalWidth>0}}')
    assert art['image']!='none' and art['font']=='0px' and art['hidden']=='true' and art['loaded'],(route,art)
    assert page.locator(f'.nav [data-nav=\"{route}\"] .label').inner_text().strip()
   assert page.locator('#content').inner_text().strip(),(width,route,'empty room')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),(width,route,'horizontal overflow')
  # Shared navigation must preserve the selected course and protected academic data.
  original_course=page.evaluate('S.courseId || S.activeCourse || null')
  # The per-course return bookmark is intentionally updated by navigation.
  def academic_state():
   return page.evaluate('()=>{const account={...S.majickAccount};delete account.studyReturn;const progress=JSON.parse(JSON.stringify(S.progress));if(progress[S.activeCourse]?.adaptiveLearning)delete progress[S.activeCourse].adaptiveLearning.lastVisit;return JSON.parse(JSON.stringify({progress,legacy:S.legacy,account}))}')
  active_course=page.evaluate('S.activeCourse')
  bookmarks=page.evaluate('S.majickAccount.studyReturn||{}')
  last_visit=page.evaluate('Number(S.progress[S.activeCourse]?.adaptiveLearning?.lastVisit||0)')
  protected=academic_state()
  for route in routes:
   page.evaluate('(route)=>navigate(route)',route)
   page.wait_for_timeout(100)
   assert page.evaluate('S.screen')==route,(width,route)
   assert page.evaluate('S.courseId || S.activeCourse || null')==original_course,(width,route,'course changed')
   assert page.evaluate('S.activeCourse')==active_course,(width,route,'active course changed')
   if route in ['learninglab','mission','livinggrimoire']:
    page.wait_for_function('(x)=>S.majickAccount.studyReturn?.[x.course]===x.route',arg={'course':active_course,'route':route})
    bookmarks[active_course]=route
   assert page.evaluate('S.majickAccount.studyReturn||{}')==bookmarks,(width,route,'wrong course bookmark changed')
   visit=page.evaluate('Number(S.progress[S.activeCourse]?.adaptiveLearning?.lastVisit||0)')
   assert last_visit<=visit<=page.evaluate('Date.now()'),(width,route,'invalid study-visit timestamp')
   last_visit=visit
   assert academic_state()==protected,(width,route,'navigation changed protected academic state')
  print(f'PASS {width}: shared room navigation preserves course and protected academic state',flush=True)
  page.evaluate("navigate('home')");page.wait_for_timeout(300)
  client=ctx.new_cdp_session(page)
  def listeners():
   counts={}
   for expression in ['window','document']:
    obj=client.send('Runtime.evaluate',{'expression':expression})['result']['objectId']
    counts[expression]=len(client.send('DOMDebugger.getEventListeners',{'objectId':obj})['listeners'])
   return counts
  before=listeners()
  for i in range(4):
   page.evaluate("navigate('mission');navigate('journal');navigate('home')");page.wait_for_timeout(150)
  assert listeners()==before,(before,listeners())
  assert page.locator('iframe').count()==0
  assert not errors,errors
  print(f'PASS {width}: {len(routes)} existing room links, nonempty content, no overflow or runtime errors; document/window listener counts stable {before}',flush=True)
  ctx.close()
 browser.close()
server.shutdown()
