from pathlib import Path
import re,sys,subprocess,tempfile
site=Path(sys.argv[1])
def fail(msg): raise SystemExit('STABILITY RESET VERIFY FAILED: '+msg)
main=(site/'index.html').read_text(encoding='utf-8')
san=(site/'sanctuary'/'index.html').read_text(encoding='utf-8')
for f in ('v3310-ui-compat.js','v3312-ui-compat.js','guardian-registry.js','majick-state-core.js','learning-lab.js','learning-lab.css','guardian-care-economy.js','v3317-main.js','sanctuary/v3317-sanctuary.js'):
    p=site/f
    if not p.exists() or not p.stat().st_size: fail('missing '+f)
for old in ('v3310-main.js','v3312-main.js','v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    if old in main: fail('obsolete main runtime still loaded: '+old)
for old in ('v3311-sanctuary.js','v3312-sanctuary.js','v3313-sanctuary.js','v3314-sanctuary.js','v3315-sanctuary.js'):
    if old in san: fail('obsolete Sanctuary runtime still loaded: '+old)
order=['v3310-ui-compat.js','v3312-ui-compat.js','guardian-registry.js','majick-state-core.js','guardian-care-economy.js','learning-lab.js','v3317-main.js']
pos=[main.find(x) for x in order]
if any(x<0 for x in pos) or pos!=sorted(pos): fail('main runtime load order is wrong')
if san.find('guardian-registry.js')<0 or san.find('v3317-sanctuary.js')<0: fail('Sanctuary registry/bridge missing')
if san.find('guardian-registry.js')>san.find('v3317-sanctuary.js'): fail('Sanctuary registry loads after bridge')
for compat_name in ('v3310-ui-compat.js','v3312-ui-compat.js'):
    compat=(site/compat_name).read_text(encoding='utf-8')
    if 'window.render=function' in compat or 'render=function' in compat or 'const prevRender=render' in compat or 'const render12=window.render' in compat:
        fail(compat_name+' still owns global render')
registry=(site/'guardian-registry.js').read_text(encoding='utf-8')
for name in ('velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara'):
    if "canon:'"+name+"'" not in registry: fail('baseline Guardian registry missing '+name)
for marker in ('function register(type,meta)','function dynamicSources()','window.V338_CANON','window.S?.legacy?.pets','window.S?.legacy?.eggs'):
    if marker not in registry: fail('extensible Guardian registry missing '+marker)
state=(site/'majick-state-core.js').read_text(encoding='utf-8')
for marker in ('window.prog=safeProg','window.course=safeCourse',"const SHARED=['xp','crystals','chests']",'bindSharedField'):
    if marker not in state: fail('state core missing '+marker)
main_bridge=(site/'v3317-main.js').read_text(encoding='utf-8')
if 'V3.3.19 Learning Intelligence' not in main_bridge: fail('main bridge does not identify Learning Intelligence')
if 'CANON[' in main_bridge: fail('main bridge still contains fixed Guardian CANON lookup')
if "const meta=registry()?.get?.(p.type);" not in main_bridge: fail('Guardian payload is not registry-driven')
if r'\\nconst canonOf' in main_bridge: fail('escaped newline leaked into JavaScript source')

san_bridge=(site/'sanctuary'/'v3317-sanctuary.js').read_text(encoding='utf-8')
if 'PROTECTED_MOTION_TYPES()' not in san_bridge: fail('Sanctuary motion loop is not registry-driven')
learning=(site/'learning-lab.js').read_text(encoding='utf-8')
for marker in ("window.MajickLearningLab","startVocabGame","calculateExpression","function stats","function renderLesson","function renderMastery"):
    if marker not in learning: fail('Learning Lab missing '+marker)
if 'learning-lab.js?v=3319' not in main or 'learning-lab.css?v=3319' not in main:
    fail('Learning Lab assets are not installed in index.html')
care=(site/'guardian-care-economy.js').read_text(encoding='utf-8')
if 'window.MajickGuardianRegistry?.get?.(type)' not in care: fail('Guardian care does not use the shared registry')

for path in (site/'guardian-registry.js',site/'majick-state-core.js',site/'learning-lab.js',site/'guardian-care-economy.js',site/'v3317-main.js',site/'sanctuary'/'v3317-sanctuary.js'):
    r=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
    if r.returncode: fail(path.name+' syntax: '+r.stderr)
print('STABILITY RESET VERIFY PASSED')
print('single main runtime order:', ' -> '.join(order))
print('baseline Guardian canon + open-ended future registry verified')
print('shared account state compatibility verified')
