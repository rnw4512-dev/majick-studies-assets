"""Actual app alchemy acceptance; verified-event fixtures exercise the real reward owner.
Run with MAJICK_URL or pass a canonical build directory; never uses an existing browser profile.
"""
import json,os,re,threading,sys
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=None
if os.environ.get('MAJICK_URL'):url=os.environ['MAJICK_URL']
else:
 root=Path(sys.argv[1] if len(sys.argv)>1 else 'current-site').resolve();server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(root)));threading.Thread(target=server.serve_forever,daemon=True).start();url='http://127.0.0.1:'+str(server.server_port)+'/index.html'
OUT=Path(os.environ.get('RECOVERY_EVIDENCE','/tmp/aetheria-alchemy-evidence'));OUT.mkdir(parents=True,exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox','--enable-unsafe-swiftshader'])
 for width in ([1366] if os.environ.get('ALCHEMY_QUICK') else [390,820,1366]):
  context=browser.new_context(viewport={'width':width,'height':900},accept_downloads=True);page=context.new_page();errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(e.stack));page.on('response',lambda r:missing.append(r.url) if r.status>=400 and '/health' not in r.url and '/release.json' not in r.url else None)
  page.goto(url);page.wait_for_function('!!window.MajickRewardCore&&!!window.MajickGameRealm&&!!window.MajickStudyProgress')
  def inv():return page.evaluate('MajickRewardCore.inventory()')
  page.evaluate('MajickRewardCore.inspect();navigate("vault");majickVaultTab("potions")')
  protected=page.evaluate('JSON.stringify({d755:S.progress.D755,d756:S.progress.D756},(k,v)=>["xp","crystals","chests"].includes(k)?undefined:v)')
  initial=inv();assert not page.evaluate('MajickRewardCore.craft("clarity-potion",{key:"insufficient"}).ok');assert inv()==initial
  assert not page.evaluate('MajickRewardCore.conjureEgg({type:"vesper"},"insufficient")');assert inv()==initial
  page.locator('[onclick="majickClaimPotionTestKit()"]').click();kit=inv();assert not page.evaluate('MajickRewardCore.claimPotionTestKit()');assert inv()==kit
  def open_recipe(name):page.locator('.majRecipe').filter(has=page.get_by_text(name,exact=True)).get_by_role('button',name='Craft potion',exact=True).click()
  open_recipe('Clarity Potion');page.get_by_role('button',name='Close brewing workshop').click();assert inv()==kit
  recipes=page.evaluate('MajickRewardCore.RECIPES')
  for recipe in recipes:
   before=inv();open_recipe(recipe['name']);page.get_by_role('button',name='Add all ingredients').click();page.get_by_role('button',name='Quick mix').click();page.get_by_role('button',name=re.compile('Bottle potion')).click();page.evaluate('majCozyNext()')
   after=inv();assert after['potions'][recipe['id']]==before['potions'].get(recipe['id'],0)+1
   for item,n in recipe['cost'].items():assert after['ingredients'][item]==before['ingredients'][item]-n
   page.get_by_role('button',name='Return to workshop').click()
   assert page.locator('.majRecipe').filter(has=page.get_by_text(recipe['name'],exact=True)).get_by_role('button',name=re.compile('Use')).count()==1
  before=inv();receipt=page.evaluate('MajickRewardCore.craft("clarity-potion",{key:"same-craft-invocation"})');assert receipt['ok'];once=inv();assert page.evaluate('MajickRewardCore.craft("clarity-potion",{key:"same-craft-invocation"}).replayed');assert inv()==once
  no_context=inv()
  for item in ['clarity-potion','crystal-sight-potion','recall-draught']:assert not page.evaluate('(id)=>MajickRewardCore.usePotion(id)',item)
  assert inv()==no_context
  # Actual unique reward events, not a second fragment counter or click-based grant.
  fragments=inv()['eggFragments'];page.evaluate('MajickRewardCore.award("concept-mastered",{key:"guided-fragment-attempt",assisted:true,independent:false})');assert inv()['eggFragments']==fragments
  for i in range(10):page.evaluate('(i)=>MajickRewardCore.award("misconception-repaired",{key:"verified-repair-fixture:"+i,course:"D772",independent:true,source:"browser-verified-event-fixture"})',i)
  assert inv()['eggFragments']==fragments+10
  page.evaluate('MajickRewardCore.award("misconception-repaired",{key:"verified-repair-fixture:0",independent:true})');assert inv()['eggFragments']==fragments+10
  page.evaluate('MajickRewardCore.showConjuring()');page.get_by_role('button',name='Not yet',exact=True).click();assert inv()['eggFragments']==fragments+10
  eggs_before=page.evaluate('S.legacy.eggs.length');page.evaluate('MajickRewardCore.showConjuring()');page.get_by_role('button',name='Seal the Egg Bond',exact=True).click()
  egg=page.evaluate('(()=>{const r=MajickStateCore.ensureAccount().rewardCore;return S.legacy.eggs.find(e=>e.id===r.lastAlchemyTransaction.eggId)})()');assert egg and page.evaluate('S.legacy.eggs.length')==eggs_before+1
  assert page.evaluate('(id)=>MajickStudyProgress.focusedEgg().id===id',egg['id'])
  pre_hatch_backup=page.evaluate('MajickSaveSafety.exportPayload(S)')
  fragment_after=inv()['eggFragments'];duplicate=page.evaluate('(egg)=>{const tx=MajickStateCore.ensureAccount().rewardCore.lastAlchemyTransaction;return MajickRewardCore.conjureEgg({type:egg.type,...egg.mystery},tx.key.slice("conjure:".length))}',egg);assert duplicate['id']==egg['id'];assert inv()['eggFragments']==fragment_after and page.evaluate('S.legacy.eggs.length')==eggs_before+1
  assert page.evaluate('MajickRewardCore.usePotion("moonfocus-elixir")');assert page.evaluate('MajickRewardCore.usePotion("starlight-tonic")')
  page.evaluate('navigate("vault");majickVaultTab("potions")');page.wait_for_timeout(5500);page.locator('.majAlchemyLedger').scroll_into_view_if_needed();page.screenshot(path=str(OUT/f'alchemy-after-{width}.png'))
  page.evaluate('switchCourse("D772");startOracleLens()');page.wait_for_selector('.realmPotionTools')
  def dismiss_evolution():
   for _ in range(5):
    overlay=page.locator('.lfEvolutionOverlay')
    if not overlay.count():break
    overlay.first.get_by_role('button',name=re.compile('Welcome home|Choose later')).first.click()
  def correct_oracle():
   dismiss_evolution()
   page.evaluate('oracleChooseLens(session.correctLens)');answer=page.evaluate('MajickGameRealm.potionContext().question.answer');dismiss_evolution();page.locator('.realmOracle .options').get_by_role('button',name=str(answer),exact=True).click();dismiss_evolution()
  effect_before=page.evaluate('JSON.parse(JSON.stringify(MajickStateCore.ensureAccount().rewardCore.activeEffects))');moon_before=page.evaluate('MajickStudyProgress.focusedEgg().progress');correct_oracle()
  fx=page.evaluate('MajickStateCore.ensureAccount().rewardCore.activeEffects');assert fx['moonfocus']==effect_before['moonfocus']-1 and fx['starlightTonic']==effect_before['starlightTonic']-1,fx
  assert page.evaluate('MajickStudyProgress.focusedEgg().progress')>=moon_before+3
  page.evaluate('oracleNext()')
  assert page.evaluate('MajickRewardCore.usePotion("recall-draught")')
  recall=page.evaluate('MajickStateCore.ensureAccount().rewardCore.activeRecall');xp_before=page.evaluate('MajickRewardCore.inspect().xp')
  page.locator('#majAlchemyRecall').get_by_role('button',name=recall['question']['answer'],exact=True).click();assert page.evaluate('MajickRewardCore.inspect().xp')==xp_before+4
  again=page.evaluate('(a)=>MajickRewardCore.submitRecall(a)',recall['question']['answer']);assert not again['ok'];assert page.evaluate('MajickRewardCore.inspect().xp')==xp_before+4
  page.locator('#majAlchemyRecall [data-recall-close]').click()
  # Some source questions intentionally have no specific clue; no-consumption is mandatory there.
  for _ in range(8):
   prepared=page.evaluate('MajickGameRealm.preparePotion("clarity-potion")')
   if prepared['ok']:break
   before=inv();assert not page.evaluate('MajickRewardCore.usePotion("clarity-potion")');assert inv()==before;correct_oracle();page.evaluate('oracleNext()')
  assert prepared['ok'],prepared
  assert page.evaluate('MajickRewardCore.usePotion("clarity-potion")');assert page.locator('[data-potion-effect=clarity] mark').is_visible()
  assert page.evaluate('MajickRewardCore.usePotion("crystal-sight-potion")');assert page.locator('[data-potion-effect=crystal-sight]').is_visible()
  fx_before_hint=page.evaluate('JSON.parse(JSON.stringify(MajickStateCore.ensureAccount().rewardCore.activeEffects))');correct_oracle()
  assert page.evaluate('MajickStateCore.ensureAccount().rewardCore.activeEffects')==fx_before_hint
  assert page.evaluate('S.progress.D772.answers.at(-1).assisted') is True
  assert page.evaluate('JSON.stringify({d755:S.progress.D755,d756:S.progress.D756},(k,v)=>["xp","crystals","chests"].includes(k)?undefined:v)')==protected
  # Hatching is keyed to the exact egg; repeated reveal cannot create another Guardian.
  page.evaluate('(id)=>{const e=S.legacy.eggs.find(e=>e.id===id);e.progress=e.goal;save();MajickCelestialIncubator.queue(e)}',egg['id']);pets_before=page.evaluate('S.legacy.pets.length')
  page.evaluate('(id)=>{MajickCelestialIncubator.complete(id);MajickCelestialIncubator.complete(id)}',egg['id']);assert page.evaluate('S.legacy.pets.length')==pets_before+1
  assert page.evaluate('(id)=>S.legacy.pets.filter(p=>p.sourceEggId===id).length',egg['id'])==1
  # Main + Council/replay backup, real download, import and recovery; preserve later reward/transaction data.
  page.evaluate('document.getElementById("majCelestialHatch")?.remove();localStorage.setItem("majick-d756-task2-rehearsal-v1",JSON.stringify({mode:"guided",profile:"angela",records:[],draft:"saved council draft"}));localStorage.setItem("majick-d756-task2-rehearsal-v1-replay",JSON.stringify({active:false,records:[{answer:"original replay evidence"}]}));navigate("control")')
  with page.expect_download() as download:page.evaluate('exportSave()')
  file=download.value.path();payload=json.loads(Path(file).read_text());assert payload['browserData']['majick-d756-task2-rehearsal-v1-replay'];assert payload['state']['majickAccount']['rewardCore']['alchemyTransactions']
  page.evaluate('MajickRewardCore.craft("clarity-potion",{key:"later-than-backup"})');after_later=inv();wallet_after=page.evaluate('MajickRewardCore.inspect().xp')
  def accept_dialog(d):d.accept()
  page.on('dialog',accept_dialog)
  page.locator('.v338SavePanel input[type=file]').set_input_files({'name':'backup.json','mimeType':'application/json','buffer':json.dumps(payload).encode()});page.wait_for_timeout(150)
  assert inv()==after_later and page.evaluate('MajickRewardCore.inspect().xp')==wallet_after
  assert page.evaluate('JSON.parse(localStorage.getItem("majick-d756-task2-rehearsal-v1")).draft')=='saved council draft'
  page.evaluate('MajickSaveSafety.restorePrevious()');page.wait_for_timeout(100);assert inv()==after_later
  page.evaluate('navigate("control")');page.locator('.v338SavePanel input[type=file]').set_input_files({'name':'older-egg-backup.json','mimeType':'application/json','buffer':json.dumps(pre_hatch_backup).encode()});page.wait_for_timeout(100)
  assert page.evaluate('(id)=>S.legacy.pets.filter(p=>p.sourceEggId===id).length',egg['id'])==1
  assert page.evaluate('(id)=>!S.legacy.eggs.some(e=>e.id===id)',egg['id'])
  saved_inventory=inv();page.reload();page.wait_for_function('!!window.MajickRewardCore');assert inv()==saved_inventory
  # Repeated same transactions after actual reload and older imported snapshots do not mint inventory.
  assert page.evaluate('MajickRewardCore.craft("clarity-potion",{key:"same-craft-invocation"}).replayed');assert inv()==saved_inventory
  future=page.evaluate('(()=>{const k=MajickSaveSafety.keys.KEY,old=localStorage.getItem(k),x=JSON.parse(old);x.saveSchemaVersion=999;const raw=JSON.stringify(x);localStorage.setItem(k,raw);let blocked=false;try{MajickSaveSafety.read()}catch(e){blocked=true}const kept=localStorage.getItem(k)===raw;localStorage.setItem(k,old);return {blocked,kept}})()');assert future=={'blocked':True,'kept':True}
  # Failed local persistence must roll back a brewing transaction, not silently spend resources.
  fail=page.evaluate('(()=>{const before=JSON.stringify(MajickRewardCore.inventory()),original=window.save;window.save=()=>{throw Error("quota-test")};const result=MajickRewardCore.craft("clarity-potion",{key:"failed-save"});window.save=original;return {ok:result.ok,unchanged:before===JSON.stringify(MajickRewardCore.inventory()),message:result.message}})()');assert not fail['ok'] and fail['unchanged'],fail
  refunded=page.evaluate('(()=>{const r=MajickStateCore.ensureAccount().rewardCore,before={...r.potions};r.legacyInstantChargesMigrated=false;r.activeEffects={...(r.activeEffects||{}),clarity:1,recall:1,crystalSight:1};MajickRewardCore.inspect();const first={...r.potions};MajickRewardCore.inspect();return {before,first,after:{...r.potions}}})()');assert refunded['first']==refunded['after'];assert all(refunded['first'][k]==refunded['before'].get(k,0)+1 for k in ['clarity-potion','recall-draught','crystal-sight-potion'])
  assert not errors,errors
  assets=[u for u in missing if u.split('?')[0].endswith(('.js','.css','.png','.webp','.jpg','.svg','.json'))];assert not assets,assets
  print('PASS',width,'five recipes, canceled/double commits, real fragment/egg/focus/hatch, five effects, assisted boundary, download/import/recovery, future schema and save-failure rollback',flush=True)
  context.close()
 browser.close()
if server:server.shutdown()
