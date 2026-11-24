"""Licensed source art stays lazy, finite, reduced-motion aware, and presentation only."""
import os,sys,threading,json
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
    # Observe the finite image lifecycle inside the same browser task that starts it.
    art=page.evaluate("async kind=>{if(!MajickAnimationEffects.play(kind))throw Error('Effect did not start: '+kind);const img=document.querySelector('.majickFxLicensed');if(!img)throw Error('Missing licensed image');await img.decode();if(!img.isConnected||!img.naturalWidth)throw Error('Image expired before it decoded: '+kind);return {src:img.src}}",kind)
    assert ('-poster.webp' in art['src'])==(mode=='reduce')
    assert page.locator('.majickFxLayer').evaluate('(e)=>getComputedStyle(e).pointerEvents')=='none'
    page.wait_for_function('!document.querySelector(".majickFx")') if mode=='reduce' and kind=='guardian' else page.evaluate('MajickAnimationEffects.clear()')
  assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==protected,'Art changes learner state'
  page.evaluate('MajickWardrobeStudio.open()');details=page.locator('.wsModelReference');details.locator('summary').click()
  for image in details.locator('img').all():assert image.evaluate('(e)=>e.complete&&e.naturalWidth>0') or image.wait_for(state='visible') is None
  page.wait_for_function('()=>[...document.querySelectorAll(".wsModelReference img")].every(i=>i.complete&&i.naturalWidth>0)')
  assert 'Clint Bellanger' in details.locator('img').first.get_attribute('alt')
  before_rings=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
  page.locator('[data-section="Accessories"]').click()
  rings=page.locator('.wsRingGallery img');assert rings.count()==10
  assert page.locator('.wsRingIntro').evaluate('(e)=>getComputedStyle(e).webkitTextFillColor')=='rgb(81, 52, 72)'
  for ring in rings.all():
   ring.scroll_into_view_if_needed()
   ring.evaluate('(e)=>e.decode()')
   assert ring.evaluate('(e)=>e.naturalWidth==160&&e.naturalHeight==160')
  assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==before_rings,'Ring previews alter learning or rewards'
  assert page.locator('.wsRingGallery').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1'),'Ring gallery overflows'
  assert page.locator('.wsControls').evaluate('(e)=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.right<=innerWidth+1}'),'Atelier controls exceed the viewport'
  page.evaluate('MajickWardrobeStudio.close()')
  page.evaluate("navigate('vault');majickVaultTab('potions')")
  assert page.locator('.majRecipe').count()==5
  backgrounds=page.locator('.majRecipe>span[aria-hidden=true]').evaluate_all('(els)=>els.map(e=>getComputedStyle(e).backgroundImage)')
  assert len(set(backgrounds))==5 and all('/models/potion-' in b for b in backgrounds)
  assert '/crystal-blue.webp' in page.locator('.majArcaneVault>header h2').evaluate('(e)=>getComputedStyle(e,"::after").backgroundImage')
  page.evaluate("majickVaultTab('ingredients')")
  assert '/plants/shrub.webp' in page.locator('.majRecipeShelf:has(.majLootGrid)>h3').evaluate('(e)=>getComputedStyle(e,"::after").backgroundImage')
  for color in ['blue','green','red','violet','yellow']:
   assert page.evaluate('async color=>{const img=new Image();img.src=new URL("assets/licensed/crystal-"+color+".webp",location.href);await img.decode();return img.naturalWidth>0&&img.naturalHeight>0}',color),'Crystal artwork failed to decode: '+color
  before_ornaments=page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')
  ornaments=[a['path'] for a in json.loads((root/'assets/licensed/asset-manifest.json').read_text())['assets'] if any('/'+kind+'/' in a['path'] for kind in ['gems','crystals','plants']) and a['path'].endswith('.webp')]
  assert len(ornaments)==9
  for asset in ornaments:
   assert page.evaluate('async path=>{const img=new Image();img.src=new URL(path,location.href);await img.decode();return img.naturalWidth===160&&img.naturalHeight===160}',asset)
  assert page.evaluate('JSON.stringify({progress:S.progress,legacy:S.legacy,account:S.majickAccount})')==before_ornaments,'Room art changes study or reward state'
  page.evaluate("S.activeCourse='D772';navigate('learninglab')")
  navigator=page.locator('.courseLessonNavigator');navigator.wait_for(state='visible')
  assert navigator.evaluate('(e)=>e.getBoundingClientRect().width>=160'),'Lesson navigator collapses to an unreadable column'
  assert '/crystal-green.webp' in navigator.locator('h3').first.evaluate('(e)=>getComputedStyle(e,"::after").backgroundImage')
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
