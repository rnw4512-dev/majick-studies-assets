from pathlib import Path
from PIL import Image
import hashlib,re,sys

site=Path(sys.argv[1]).resolve()
repo=Path(sys.argv[2]).resolve()
san=site/'sanctuary'

def fail(msg):
    raise AssertionError(msg)

def sha(path):
    h=hashlib.sha256()
    with open(path,'rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):
            h.update(chunk)
    return h.hexdigest()

# 1) Protected original motion files must remain byte-for-byte identical.
pairs=[
 ('luna-idle.png','luna-idle.png'),
 ('luna-walk-1.png','luna-walk-1.png'),
 ('luna-walk-2.png','luna-walk-2.png'),
 ('luna-hop.png','luna-hop.png'),
 ('ember-idle.png','ember-idle.png'),
 ('ember-walk-1.png','ember-walk-1.png'),
 ('ember-walk-2.png','ember-walk-2.png'),
 ('ember-hop.png','ember-hop.png'),
 ('ember-slither-1.png','ember-slither-1.png'),
 ('ember-slither-2.png','ember-slither-2.png'),
 ('ember-sit.png','ember-sit.png'),
 ('ember-sleep.png','ember-sleep.png'),
 ('nova-walk-1.png','nova-walk-1.png'),
 ('nova-walk-2.png','nova-walk-2.png'),
 ('nova-run.png','nova-run.png'),
 ('nova-hop.png','nova-hop.png'),
 ('nova-paw.png','nova-paw.png'),
 ('nova-spin.png','nova-spin.png'),
 ('nova-sit.png','nova-sit.png'),
 ('nova-sleep.png','nova-sleep.png'),
 ('nova-pounce.png','nova-pounce.png'),
 ('nova-pounce2.png','nova-pounce2.png'),
 ('nova-pounce3.png','nova-pounce3.png'),
 ('mallow-idle.png','mallow-idle.png'),
 ('mallow-hop-1.png','mallow-hop-1.png'),
 ('mallow-hop-2.png','mallow-hop-2.png'),
 ('mallow-fly 1.png','mallow-fly-1.png'),
 ('mallow-fly 2.png','mallow-fly-2.png'),
 ('mallow-paw.png','mallow-paw.png'),
 ('mallow-sit.png','mallow-sit.png'),
 ('mallow-sleep.png','mallow-sleep.png'),
 ('mallow-land.png','mallow-land.png'),
 ('mallow-binky.png','mallow-binky.png'),
]
motion=san/'assets'/'motion'
if len(list(motion.glob('*.png')))!=33: fail('Protected motion folder must contain exactly 33 PNGs')
for src_name,dst_name in pairs:
    src=repo/src_name
    dst=motion/dst_name
    if not src.exists(): fail(f'Missing source protected motion file: {src_name}')
    if not dst.exists(): fail(f'Missing deployed protected motion file: {dst_name}')
    if sha(src)!=sha(dst): fail(f'Protected motion file changed: {dst_name}')

# 2) Phaser startup must use lightweight derived runtime assets.
runtime=san/'assets'/'runtime-motion'
runtime_files=sorted(runtime.glob('*.webp'))
if len(runtime_files)!=33: fail(f'Expected 33 runtime motion WebPs, found {len(runtime_files)}')
runtime_bytes=sum(p.stat().st_size for p in runtime_files)
if runtime_bytes>4*1024*1024: fail(f'Runtime motion bundle too large: {runtime_bytes} bytes')
for p in runtime_files:
    with Image.open(p) as im:
        if im.width>512 or im.height>512:
            fail(f'Runtime motion image exceeds 512px: {p.name} {im.size}')

runtime_objects=san/'assets'/'runtime-objects'
object_files=sorted(runtime_objects.glob('*.webp'))
if len(object_files)<9: fail(f'Expected at least 9 runtime furniture WebPs, found {len(object_files)}')
object_bytes=sum(p.stat().st_size for p in object_files)
if object_bytes>2*1024*1024: fail(f'Runtime furniture bundle too large: {object_bytes} bytes')
for p in object_files:
    with Image.open(p) as im:
        if im.width>512 or im.height>512:
            fail(f'Runtime furniture image exceeds 512px: {p.name} {im.size}')

bg=site/'assets'/'academy_hero.jpg'
startup_bytes=runtime_bytes+object_bytes+(bg.stat().st_size if bg.exists() else 0)
if startup_bytes>5*1024*1024:
    fail(f'Phaser startup image budget exceeded: {startup_bytes} bytes')

pre=(san/'Preloader.js').read_text(encoding='utf-8')
if "const base = './assets/runtime-motion/';" not in pre:
    fail('Preloader is not using runtime-motion')
if './assets/motion/' in pre:
    fail('Preloader references protected full-size motion folder')
if re.search(r"base\s*\+\s*['\"][^'\"]+\.png['\"]",pre):
    fail('Preloader still requests PNG motion assets')
if './assets/runtime-objects/' not in pre:
    fail('Preloader is not using runtime furniture')

# 3) Evolution art remains final-clean and on-demand; do not rebuild 60 files during CI.
evo=san/'assets'/'evolutions'
evo_actions=[p for p in evo.rglob('*.webp') if p.name in ('walk.webp','play.webp','sleep.webp')]
if len(evo_actions)!=60: fail(f'Expected exactly 60 evolution action WebPs, found {len(evo_actions)}')
if (san/'assets'/'runtime-evolutions').exists():
    fail('runtime-evolutions should not be generated; evolution art must stay on-demand')
v3317=(san/'v3317-sanctuary.js').read_text(encoding='utf-8')
if "'./assets/evolutions/'" not in v3317:
    fail('V3.3.17 must load final-clean evolution art from assets/evolutions')
if 'runtime-evolutions' in v3317:
    fail('V3.3.17 still references runtime-evolutions')

# 4) Exactly one post-movement Sanctuary owner is allowed.
idx=(san/'index.html').read_text(encoding='utf-8')
scripts=re.findall(r'<script[^>]+src=["\']([^"\']+)',idx)
expected=[
 './phaser.min.js',
 './Boot.js',
 './MainMenu.js',
 './Preloader.js',
 './Game.js',
 './v3310-sanctuary.js?v=3310',
 './v3317-sanctuary.js?v=3317-clean',
 './bridge.js',
]
if scripts!=expected:
    fail('Unexpected Sanctuary script chain: '+repr(scripts))
for old in ('v3311-sanctuary.js','v3312-sanctuary.js','v3313-sanctuary.js','v3314-sanctuary.js','v3315-sanctuary.js'):
    if (san/old).exists() or old in idx:
        fail(f'Old Sanctuary wrapper returned: {old}')

# 5) V3.3.10 movement methods stay, but the normal-load scene restart race stays removed.
v3310=(san/'v3310-sanctuary.js').read_text(encoding='utf-8')
for method in ('chooseLunaBehavior','chooseEmberBehavior','chooseNovaBehavior','chooseMallowBehavior','v3310StartMotionDirector'):
    if method not in v3310: fail(f'Protected movement method missing: {method}')
if 'liveScene.scene.restart()' in v3310:
    fail('V3.3.10 startup scene restart race is present')

# 6) Main shell must not contain a self-triggering release-badge observer.
main=(site/'v3317-main.js').read_text(encoding='utf-8')
if "pill&&pill.textContent!==RELEASE_LABEL" not in main:
    fail('Release badge write is not guarded against MutationObserver feedback')
if "document.title!==RELEASE_TITLE" not in main:
    fail('Document title write is not guarded')
if 'Majick V3.3.17 runtime error' not in main:
    fail('V3.3.17 runtime error boundary is missing')

# 7) Required study features remain present.
for p in (
 site/'study-material'/'materialParser.js',
 site/'study-material'/'materialStoreModel.js',
 site/'study-material'/'questionBuilder.js',
 site/'study-material'/'AddStudyMaterialPage.js',
 site/'courseManager.js',
):
    if not p.exists() or p.stat().st_size==0: fail(f'Missing study feature: {p}')

print('V3.3.17 RELEASE VERIFIER PASSED')
print('protected motion: 33 byte-identical originals')
print('runtime motion bytes:',runtime_bytes)
print('runtime furniture bytes:',object_bytes)
print('startup image bytes:',startup_bytes)
print('Sanctuary script chain:',scripts)


# 8) Core Sanctuary object contract must stay internally consistent.
manifest_path=san/'assets'/'objects'/'objects-manifest.json'
if not manifest_path.exists(): fail('Missing Sanctuary object manifest')
import json
obj_manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
by_id={o.get('id'):o for o in obj_manifest.get('objects',[])}

expected_actions={
 'arcane-stacks':'openArcaneStacks',
 'moonlit-study-desk':'openStudyDesk',
 'observatory-telescope':'openObservatory',
 'crystal-focus-pedestal':'openCrystalFocus',
 'study-apothecary':'openCrystalFocus',
 'familiar-lounge':'openFamiliarLounge',
 'magic-mirror':'showMirrorPanel',
}
for oid,action in expected_actions.items():
    o=by_id.get(oid)
    if not o: fail(f'Missing core Sanctuary object: {oid}')
    if not o.get('preload'): fail(f'Core Sanctuary object is not preloaded: {oid}')
    if not o.get('placement'): fail(f'Core Sanctuary object has no placement: {oid}')
    if o.get('panelAction')!=action:
        fail(f'Wrong panelAction for {oid}: {o.get("panelAction")} != {action}')

for oid,slot in (('moonstone-crystal-bed','bed-west'),('amethyst-crystal-bed','bed-east')):
    o=by_id.get(oid)
    if not o: fail(f'Missing Guardian bed: {oid}')
    if o.get('interaction')!='assign-rest': fail(f'{oid} must use assign-rest')
    if o.get('panelAction'): fail(f'{oid} must not bypass its slot with panelAction')
    if (o.get('placement') or {}).get('slot')!=slot: fail(f'{oid} must target {slot}')

if obj_manifest.get('interactionPolicy',{}).get('persistedLayoutKey')!='majick-sanctuary-layout-v2':
    fail('Sanctuary layout persistence key changed unexpectedly')

assign_idx=v3317.find("if(obj.interaction==='assign-rest')")
panel_idx=v3317.find("const panel=obj.panelAction")
if assign_idx<0 or panel_idx<0 or assign_idx>panel_idx:
    fail('V3.3.17 does not evaluate assign-rest before generic panelAction')
if obj_manifest.get('interactionPolicy',{}).get('specialInteractionBeforePanelAction') is not True:
    fail('Object manifest does not require special interactions before panelAction')
if "v3317CheckCoreObjects" not in v3317:
    fail('V3.3.17 core-object runtime health check is missing')
if "hitW=Math.max(150" not in v3317:
    fail('V3.3.17 responsive object hit areas are missing')

print('core Sanctuary object contract: 9 startup objects verified')


# 9) Notes Forge source lifecycle and course isolation.
store=(site/'study-material'/'materialStoreModel.js').read_text(encoding='utf-8')
page=(site/'study-material'/'AddStudyMaterialPage.js').read_text(encoding='utf-8')
course_mgr=(site/'courseManager.js').read_text(encoding='utf-8')

required_store_markers=[
    "rows=rows.filter(x=>x.courseId===courseId)",
    "rows.filter(r=>r.active!==false)",
    "courseObj.questionBank=courseObj.questionBank.filter(q=>!isNotesForgeQuestion(q))",
    "async function setActive(id,active)",
    "async function syncQuestions(courseObj,courseId)",
    "managedBy:'notes-forge'",
]
for marker in required_store_markers:
    if marker not in store:
        fail('Notes Forge store contract missing: '+marker)

required_page_markers=[
    "Open</button>",
    "Regenerate</button>",
    "Pause':'Activate",
    "async function openSource(id)",
    "async function regenerateSource(id)",
    "async function toggleSource(id)",
    "async function removeSource(id)",
    "await MajickMaterialStore.syncQuestions(c,courseId)",
]
for marker in required_page_markers:
    if marker not in page:
        fail('Notes Forge page lifecycle missing: '+marker)

required_course_markers=[
    "streak:0",
    "if(r.status==='passed')",
    "S.activeCourse=id",
    "S.progress[code]=blankProgress()",
    "S.majickAccount.xp=Number(S.majickAccount.xp||0)+PASS_XP",
]
for marker in required_course_markers:
    if marker not in course_mgr:
        fail('Course isolation/pass contract missing: '+marker)

print('Notes Forge lifecycle + course isolation contract verified')


# 10) Guardian care + Moon Crystal economy must stay roster-driven.
care_js=(site/'guardian-care-economy.js')
care_css=(site/'guardian-care-economy.css')
if not care_js.exists() or care_js.stat().st_size==0:
    fail('Guardian care economy JavaScript is missing')
if not care_css.exists() or care_css.stat().st_size==0:
    fail('Guardian care economy CSS is missing')

care=care_js.read_text(encoding='utf-8')
required_care_markers=[
    "function ownedPets()",
    "function incubatingEggs()",
    "window.S?.legacy?.pets",
    "window.S?.legacy?.eggs",
    "guardianCare.guardians[pet.id]",
    "function performAction(target,action,opts={})",
    "action==='feed'",
    "action==='water'",
    "action==='treat'",
    "action==='groom'",
    "action==='play'",
    "action==='sleep'",
    "action==='affection'",
    "function buy(id)",
    "guardianCareHTML",
    "catalogHTML",
    "eggs:eggSnapshot()",
]
for marker in required_care_markers:
    if marker not in care:
        fail('Guardian care contract missing: '+marker)

if "const TYPES=['luna','ember','nova','mallow']" in care:
    fail('Guardian care regressed to a fixed four-Guardian roster')
if "roster:[],guardians:{},byType:{},eggs:[]" not in v3317:
    fail('Phaser care state is not roster/egg aware')
if "openGuardianCarePicker" not in v3317:
    fail('Phaser Guardian-care picker is missing')
if "guardianId" not in v3317 or "guardianType" not in v3317:
    fail('Phaser care bridge is not Guardian-instance aware')
if "openGuardianCarePicker?.('sleep'" not in v3317:
    fail('Beds are not routed through the live Guardian roster')

care_manifest=obj_manifest.get('careSystem',{})
if care_manifest.get('rosterDriven') is not True:
    fail('Sanctuary care manifest is not roster-driven')
if care_manifest.get('petIdentityKey')!='pet.id':
    fail('Sanctuary care state must key Guardians by pet.id')
if care_manifest.get('eggsRemainIncubatingUntilHatch') is not True:
    fail('Eggs must remain separate from care until they hatch')

care_objects={
    'guardian-food-bowl':'feed',
    'guardian-water-basin':'water',
    'guardian-treat-jar':'treat',
    'guardian-brush':'groom',
    'guardian-toy-basket':'play',
    'guardian-play-rug':'play',
}
for oid,action in care_objects.items():
    o=by_id.get(oid)
    if not o: fail(f'Missing care object: {oid}')
    if not o.get('preload'): fail(f'Care object is not preloaded: {oid}')
    if not o.get('placement'): fail(f'Care object has no Sanctuary placement: {oid}')
    if o.get('interaction')!='guardian-care': fail(f'{oid} must use guardian-care')
    if o.get('careAction')!=action: fail(f'{oid} must perform {action}')

manifest_preloads=[o for o in obj_manifest.get('objects',[]) if o.get('enabled',True) and o.get('preload')]
if len(object_files)!=len(manifest_preloads):
    fail(f'Runtime furniture count {len(object_files)} does not match manifest preload count {len(manifest_preloads)}')

main_index=(site/'index.html').read_text(encoding='utf-8')
if 'guardian-care-economy.css?v=3317-care' not in main_index:
    fail('Guardian care stylesheet is not loaded')
if 'guardian-care-economy.js?v=3317-care' not in main_index:
    fail('Guardian care JavaScript is not loaded')
if main_index.find('guardian-care-economy.js?v=3317-care') > main_index.find('v3317-main.js?v=3317-clean'):
    fail('Guardian care must load before the V3.3.17 main bridge')

print('Guardian care + Moon Crystal economy contract verified')
print('owned-roster model: pet.id')
print('egg model: incubator until hatch')
print('care stations verified:',len(care_objects))
