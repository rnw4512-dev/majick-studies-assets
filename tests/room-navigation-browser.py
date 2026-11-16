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
   assert page.locator('#content').inner_text().strip(),(width,route,'empty room')
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+2'),(width,route,'horizontal overflow')
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
