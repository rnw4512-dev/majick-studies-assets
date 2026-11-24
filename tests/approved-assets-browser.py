"""Licensed source art stays lazy, finite, reduced-motion aware, and presentation only."""
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
  context=browser.new_context(viewport={'width':width,'height':1000});page=context.new_page();errors=[];requests=[]
  page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'));page.wait_for_function('!!window.MajickAnimationEffects && !!window.MajickWardrobeStudio');page.wait_for_timeout(500)
  page.route('**/effects/nature-poster.webp*',lambda route:(page.wait_for_timeout(650),route.continue_()))
  assert not any('/assets/licensed/effects/' in u or '/assets/licensed/audio/' in u for u in requests),'Large decorative assets loaded before use'
  protected=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
  for mode in ['no-preference','reduce']:
   page.emulate_media(reduced_motion=mode)
   for kind in ['lesson','guardian','mastery','reward']:
    page.evaluate('(kind)=>MajickAnimationEffects.play(kind)',kind)
    page.wait_for_function('()=>{const img=document.querySelector(".majickFxLicensed");return img?.complete&&img.naturalWidth>0}')
    art=page.locator('.majickFxLicensed');assert ('-poster.webp' in art.get_attribute('src'))==(mode=='reduce')
    assert page.locator('.majickFxLayer').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none'
    page.wait_for_function('!document.querySelector(".majickFx")') if mode=='reduce' and kind=='guardian' else page.evaluate('MajickAnimationEffects.clear()')
  assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==protected,'Art changes learner state'
  page.evaluate('MajickWardrobeStudio.open()');details=page.locator('.wsModelReference');details.locator('summary').click()
  for image in details.locator('img').all():assert image.evaluate('(e)=>e.complete&&e.naturalWidth>0') or image.wait_for(state='visible') is None
  page.wait_for_function('()=>[...document.querySelectorAll(".wsModelReference img")].every(i=>i.complete&&i.naturalWidth>0)')
  assert 'Clint Bellanger' in details.locator('img').first.get_attribute('alt')
  page.evaluate('MajickWardrobeStudio.close()')
  page.evaluate("navigate('vault');majickVaultTab('potions')")
  assert page.locator('.majRecipe').count()==5
  backgrounds=page.locator('.majRecipe>span[aria-hidden=true]').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).backgroundImage)')
  assert len(set(backgrounds))==5 and all('/models/potion-' in b for b in backgrounds)
  page.locator('.caAmbience').click();page.wait_for_function('MajickCollegiumAtmosphere.inspect().playing')
  for room in ['home','learninglab','livinggrimoire','games','companions']:
   page.wait_for_timeout(170);assert page.evaluate('(room)=>MajickCollegiumAtmosphere.micro("enter",room)',room)
  assert page.evaluate('MajickCollegiumAtmosphere.inspect().spellClips')==5
  page.locator('.caAmbience').click();assert not page.evaluate('MajickCollegiumAtmosphere.inspect().playing')
  assert not page.evaluate('MajickCollegiumAtmosphere.micro("enter","home")'),'Muted audio still plays'
  assert not errors,errors
  print(f'PASS licensed assets {width}: lazy art/audio, all four effects/posters, unchanged learner state, rendered figure studies, five potion previews, opt-in sounds and mute',flush=True)
  context.close()
 browser.close()
server.shutdown()
