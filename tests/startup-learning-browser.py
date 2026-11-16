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
url=f'http://127.0.0.1:{server.server_port}/'
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
  assert not errors,errors
  print(f'PASS {width}: Home has no hidden scene; Q1→Q2, stale handler, correct/incorrect feedback, keyboard collapse, completion/XP replay and reload/draft persistence',flush=True)
  ctx.close()
 browser.close()
server.shutdown()
