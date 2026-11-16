from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import threading,json,statistics,sys,os
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
servers=[]
if len(sys.argv)<3:raise SystemExit('Usage: profile-startup.py BASELINE_DIRECTORY CANDIDATE_DIRECTORY [OUTPUT_JSON]')
for folder in sys.argv[1:3]:
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=folder));threading.Thread(target=server.serve_forever,daemon=True).start();servers.append(server)
rows=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'])
 for i in range(5):
  for label,server in zip(['before','after'],servers):
   c=b.new_context(viewport={'width':1366,'height':900});page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.add_init_script('''window.audit={long:[],renders:0};new PerformanceObserver(l=>audit.long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});const d=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{...d,set(value){if(this.id==='app')audit.renders++;return d.set.call(this,value)}})''')
   client=c.new_cdp_session(page);client.send('Performance.enable');page.goto(f'http://127.0.0.1:{server.server_port}/',wait_until='load');page.wait_for_timeout(1500)
   result=page.evaluate('''()=>({audit,dom:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,load:performance.getEntriesByType('navigation')[0].loadEventEnd,frames:document.querySelectorAll('iframe').length,transferBytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0),scriptBytes:[...document.scripts].filter(s=>s.src).length})''')
   result.update(label=label,run=i+1,errors=errors,metrics=client.send('Performance.getMetrics')['metrics']);rows.append(result)
   print(label,i+1,'DOM',round(result['dom']),'long',round(sum(t['duration'] for t in result['audit']['long'])),'renders',result['audit']['renders'],flush=True);c.close()
 b.close()
Path(sys.argv[3] if len(sys.argv)>3 else '/tmp/aetheria-startup-profile.json').write_text(json.dumps({'conditions':'Alternating before/after, same Chromium binary, clean browser contexts, 1366x900, localhost, no throttling, no other browser suites running; 1500ms post-load observation. Baseline and candidate directories provided as arguments. Transfer is top-document resource timing, not decoded memory.','runs':rows},indent=2))
for label in ['before','after']:
 r=[x for x in rows if x['label']==label];print(label,json.dumps({'medianDomMs':round(statistics.median(x['dom'] for x in r)),'medianLoadMs':round(statistics.median(x['load'] for x in r)),'medianLongMs':round(statistics.median(sum(t['duration'] for t in x['audit']['long']) for x in r)),'medianTransferBytes':round(statistics.median(x['transferBytes'] for x in r)),'renders':r[0]['audit']['renders'],'frames':r[0]['frames']}))
for s in servers:s.shutdown()
