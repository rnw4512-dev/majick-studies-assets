"""Sanctuary rendering/appearance diagnostics on fresh fictitious saved state."""
import os,json,threading,sys
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
url='http://127.0.0.1:'+str(server.server_port)+'/index.html'
out=Path(os.environ.get('RECOVERY_EVIDENCE','/tmp/aetheria-sanctuary-evidence'));out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for width in [390,820,1366]:
  ctx=browser.new_context(viewport={'width':width,'height':1000});page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(e.stack))
  page.goto(url);page.wait_for_function('!!window.MajickSanctuaryState&&!!window.MajickAtelier&&!!window.MajickWardrobeStudio')
  page.evaluate('''()=>{const types=['moon-cat','pocket-dragon','star-fox','winged-bunny','starlight-owl','moonlit-fawn','cloud-ferret','crystal-axolotl','twilight-raven','sunrise-hedgehog','moonlit-fawn'];S.legacy.pets=types.map((type,i)=>({id:'recovery-pet-'+i,type,name:i===5||i===10?'Briar':'Guardian '+i,studyXP:i===10?280:0}));S.legacy.activePetId='recovery-pet-0';ensureV3();MajickGuardianCare.ensure();MajickAtelier.player().accessory='saved-accessory-fixture';save();navigate('companions')}''')
  def frame():return page.locator('#phase4SanctuaryFrame').element_handle().content_frame()
  def inspect():return frame().evaluate('MajickPixiSanctuary.inspect()')
  def ready():frame().wait_for_function('window.MajickPixiSanctuary?.inspect().roster.length===11&&MajickPixiSanctuary.inspect().roster.every(p=>p.present)')
  page.wait_for_selector('#phase4SanctuaryFrame',state='attached');ready()
  # Open the existing room section using its actual navigation button.
  page.evaluate('''()=>{MajickRoomSections.refresh();const f=document.querySelector('#phase4SanctuaryFrame'),p=f.closest('.phase4Wrap');[...document.querySelectorAll('#majickRoomSections button')].find(b=>b.getAttribute('aria-controls')===p.id)?.click()}''')
  page.locator('.majSanctuaryScholar button').click();page.locator('#wsOverlay [data-hair="4"]').click();page.locator('#wsOverlay [data-section="Wardrobe"]').click();page.locator('#wsOverlay [data-robe="2"]').click();page.locator('#wsOverlay #wsLookName').fill('Sanctuary Recovery');page.locator('#wsOverlay [data-save-slot]').click();page.locator('#wsOverlay [data-save]').click();page.locator('#wsOverlay [data-close]').click()
  page.wait_for_selector('.majSanctuaryScholar img[data-avatar-layer="layer-hair-twists-v2.webp"]');page.wait_for_selector('.majSanctuaryScholar img[data-avatar-layer="layer-dress-emerald-v1.webp"]')
  assert page.evaluate('MajickAtelier.player().accessory')=='saved-accessory-fixture'
  assert page.locator('.majSanctuaryScholar').inner_text().find('Fitted accessory artwork is pending')>=0
  before=page.evaluate('JSON.stringify({pets:S.legacy.pets,progress:S.progress,account:S.majickAccount})')
  snap=inspect();assert len({p['petId'] for p in snap['roster']})==11;assert len([p for p in snap['roster'] if p['name']=='Briar'])==2
  assert [p['canon'] for p in snap['roster']]==['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara','briar']
  assert snap['roster'][-1]['stage']=='ascendant';assert snap['diagnostics']['spawns']==11;assert snap['diagnostics']['approvedFourFrameGaps']
  for row in snap['roster']:
   assert row['walkFrames'] in [1,2];assert row['frameDimensions']['width']>0;assert not row['walkCycleComplete']
  # Honest speed control uses the one existing ticker, preserves saved state.
  frame().locator('#walk-speed').select_option('0.5');assert inspect()['diagnostics']['walkSpeed']==.5
  frame().locator('#walk-speed').select_option('1.5');assert inspect()['diagnostics']['walkSpeed']==1.5
  ticks=inspect()['diagnostics']['ticks'];page.wait_for_timeout(1500);assert inspect()['diagnostics']['ticks']>ticks
  frame().locator('#toggle').click();positions=[(g['x'],g['y']) for g in inspect()['guardians']];page.wait_for_timeout(400);assert positions==[(g['x'],g['y']) for g in inspect()['guardians']]
  frame().locator('#toggle').click();frame().locator('#reset').click();assert inspect()['diagnostics']['spawns']==11
  # Selector repair: recognize actual primary iframe ID even without legacy CSS class.
  page.evaluate('document.querySelector("#phase4SanctuaryFrame").classList.remove("v3317SanctuaryFrame");MajickSanctuaryAudit.request(document.querySelector("#phase4SanctuaryFrame"))')
  page.wait_for_function('MajickSanctuaryAudit.status()[0]?.present===11')
  # Untrusted route messages may not navigate the parent.
  page.evaluate('window.postMessage({type:"MAJICK_OPEN_ROUTE",route:"mission"},location.origin)');page.wait_for_timeout(100);assert page.evaluate('S.screen')=='companions'
  assert page.evaluate('JSON.stringify({pets:S.legacy.pets,progress:S.progress,account:S.majickAccount})')==before
  page.wait_for_function('document.querySelector("#phase4SanctuaryFrame").clientHeight>700');assert frame().evaluate('document.querySelector("#room").getBoundingClientRect().bottom<=innerHeight');page.locator('.majSanctuaryScholar').screenshot(path=str(out/f'sanctuary-scholar-{width}.png'));frame().locator('#room').scroll_into_view_if_needed();page.screenshot(path=str(out/f'sanctuary-after-{width}.png'));frame().locator('#room').screenshot(path=str(out/f'sanctuary-floor-{width}.png'))
  page.reload();page.wait_for_selector('#phase4SanctuaryFrame',state='attached');ready();assert page.evaluate('MajickAtelier.player().hair')==4;assert page.evaluate('MajickAtelier.player().robe')==2;assert page.evaluate('MajickAtelier.player().savedScholarLooks.some(l=>l.name==="Sanctuary Recovery")')
  assert page.evaluate('JSON.stringify({pets:S.legacy.pets,progress:S.progress,account:S.majickAccount})')==before
  # Force one missing texture in a test-only context. Identity stays saved and visibly labeled.
  pattern='**/sanctuary/assets/evolutions/velora/new-bond/walk.webp*'
  page.route(pattern,lambda route:route.fulfill(status=404,body='Injected missing artwork'))
  page.evaluate('document.querySelector("#phase4SanctuaryFrame").contentWindow.location.reload()')
  frame().wait_for_function('window.MajickPixiSanctuary?.inspect().roster.some(p=>p.petId==="recovery-pet-0"&&p.visibleFallback)')
  assert inspect()['diagnostics']['missingTextures'];assert inspect()['roster'][0]['petId']=='recovery-pet-0'
  page.wait_for_function('MajickSanctuaryAudit.status()[0]?.missing?.length===1')
  page.evaluate('''()=>{MajickRoomSections.refresh();const p=document.querySelector('#phase4SanctuaryFrame').closest('.phase4Wrap');[...document.querySelectorAll('#majickRoomSections button')].find(b=>b.getAttribute('aria-controls')===p.id)?.click()}''')
  oldticks=inspect()['diagnostics']['ticks'];page.once('dialog',lambda d:d.dismiss());page.get_by_role('button',name='Repair room',exact=True).click();assert inspect()['diagnostics']['ticks']>=oldticks
  page.unroute(pattern);page.once('dialog',lambda d:d.accept());page.get_by_role('button',name='Repair room',exact=True).click();ready()
  assert page.evaluate('JSON.stringify({pets:S.legacy.pets,progress:S.progress,account:S.majickAccount})')==before
  assert not errors,errors
  print('PASS',width,'11 exact identities, stages, honest frame gaps, one ticker, pause/speed, shared wardrobe/avatar persistence, safe missing-art fallback, confirmed repair and route-source isolation',flush=True)
  (out/f'sanctuary-diagnostics-{width}.json').write_text(json.dumps(inspect(),indent=2)+'\n');ctx.close()
 browser.close()
server.shutdown()
