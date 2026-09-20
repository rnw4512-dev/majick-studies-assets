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
