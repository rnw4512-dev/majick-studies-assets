"""Real brewing dialog: viewport fit, keyboard containment, cancellation and painted bottle."""
import os,sys,threading,re
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve()
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start()
out=Path(os.environ.get('BREWING_EVIDENCE','/tmp/aetheria-brewing-evidence'));out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for width in [390,820,1366]:
  context=browser.new_context(viewport={'width':width,'height':900},reduced_motion='reduce');page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(os.environ.get('MAJICK_URL',f'http://127.0.0.1:{server.server_port}/'))
  page.wait_for_function('!!window.MajickRewardCore');page.evaluate('navigate("vault");majickVaultTab("potions")')
  page.locator('[onclick="majickClaimPotionTestKit()"]').click()
  inventory=lambda:page.evaluate('JSON.stringify(MajickRewardCore.inventory())')
  protected=lambda:page.evaluate('JSON.stringify({progress:S.progress,xp:S.majickAccount.xpHighWater,guardians:S.legacy.pets})')
  original=inventory();study=protected()
  craft=page.locator('.majRecipe').filter(has=page.get_by_text('Clarity Potion',exact=True)).get_by_role('button',name='Craft potion',exact=True)
  craft.click();dialog=page.get_by_role('dialog',name='Clarity Potion');close=page.get_by_role('button',name='Close brewing workshop')
  assert dialog.evaluate('(e)=>{const r=e.getBoundingClientRect();return r.top>=8&&r.bottom<=innerHeight-8&&r.left>=0&&r.right<=innerWidth}'),'Dialog is clipped'
  assert close.evaluate('(e)=>e===document.activeElement&&e.getBoundingClientRect().top>=8'),'Close control is clipped or unfocused'
  page.keyboard.press('Shift+Tab');assert page.get_by_role('button',name=re.compile('Add all ingredients')).evaluate('(e)=>e===document.activeElement')
  page.keyboard.press('Tab');assert close.evaluate('(e)=>e===document.activeElement')
  page.keyboard.press('Escape');assert page.get_by_role('dialog').count()==0;assert craft.evaluate('(e)=>e===document.activeElement');assert inventory()==original
  craft.click();page.get_by_role('button',name=re.compile('Add all ingredients')).click();page.get_by_role('button',name='Quick mix',exact=True).click()
  assert inventory()==original,'Ingredients spent before confirmation'
  assert dialog.get_by_role('status').inner_text()=='Ready to bottle.'
  dialog.screenshot(path=str(out/f'ready-{width}.png'))
  page.get_by_role('button',name=re.compile('Bottle potion')).click()
  bottle=page.locator('.majCozyScene img.cozyGlassVessel');page.wait_for_function('!!document.querySelector(".majCozyScene img.cozyGlassVessel")?.naturalWidth')
  assert bottle.get_attribute('src').endswith('/potions/purple.webp')
  assert 'Potion saved.' in dialog.get_by_role('status').inner_text()
  assert bottle.evaluate('(e)=>e.naturalWidth===192&&e.naturalHeight===192')
  assert page.locator('.majCozyPixiLayer').count()<=1
  dialog.screenshot(path=str(out/f'bottled-{width}.png'))
  assert protected()==study,'Visual workflow changed academic progress or Guardians'
  after=inventory();page.evaluate('majCozyNext()');assert inventory()==after,'Repeated finish spent ingredients twice'
  page.get_by_role('button',name='Return to workshop',exact=True).click();assert page.get_by_role('dialog').count()==0
  if width==820:
   page.evaluate("S.majickAccount.crystals=100;save();navigate('vault')")
   page.get_by_role('tab',name='Shop & Chests',exact=True).click()
   upgrade=page.locator('.majCareShopGrid article').filter(has=page.get_by_role('heading',name='Starlight Sanctuary Upgrade'))
   upgrade.get_by_role('button',name='Unlock').click()
   assert upgrade.get_by_role('button',name='Owned').is_disabled()
   assert page.evaluate('S.majickAccount.crystals')==25
   assert page.evaluate("MajickGuardianCare.buy('sanctuary-upgrade-token').ok") is False
   assert page.evaluate('S.majickAccount.crystals')==25
   page.evaluate('MajickSaveSafety.flush()');page.reload(wait_until='domcontentloaded')
   page.wait_for_function("!!window.MajickGuardianCare && typeof window.phase4SanctuaryHTML==='function'")
   page.evaluate("navigate('companions')")
   arch=page.locator('section[data-sanctuary-starlight] .majSanctuaryStarlight')
   assert 'Starlight Arch' in arch.text_content(), repr(arch.text_content())
   assert arch.locator('span').evaluate("el=>getComputedStyle(el).animationName")=='none'
   assert page.evaluate('S.majickAccount.crystals')==25
   print('PASS permanent Sanctuary upgrade, one crystal debit and saved reduced-motion arch',flush=True)
  assert not errors,errors
  print('PASS',width,'dialog fit, focus loop, Escape/cancel, painted bottle, single renderer, protected learning and idempotent confirmation',flush=True)
  context.close()
 browser.close()
server.shutdown()
