from pathlib import Path
import re,sys,subprocess,tempfile
site=Path(sys.argv[1])
def fail(msg): raise SystemExit('STABILITY RESET VERIFY FAILED: '+msg)
main=(site/'index.html').read_text(encoding='utf-8')
san=(site/'sanctuary'/'index.html').read_text(encoding='utf-8')
for f in ('guardian-registry.js','majick-state-core.js','guardian-care-economy.js','v3317-main.js','sanctuary/v3317-sanctuary.js'):
    p=site/f
    if not p.exists() or not p.stat().st_size: fail('missing '+f)
for old in ('v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    if old in main: fail('obsolete main runtime still loaded: '+old)
for old in ('v3311-sanctuary.js','v3312-sanctuary.js','v3313-sanctuary.js','v3314-sanctuary.js','v3315-sanctuary.js'):
    if old in san: fail('obsolete Sanctuary runtime still loaded: '+old)
order=['guardian-registry.js','majick-state-core.js','guardian-care-economy.js','v3317-main.js']
pos=[main.find(x) for x in order]
if any(x<0 for x in pos) or pos!=sorted(pos): fail('main runtime load order is wrong')
if san.find('guardian-registry.js')<0 or san.find('v3317-sanctuary.js')<0: fail('Sanctuary registry/bridge missing')
if san.find('guardian-registry.js')>san.find('v3317-sanctuary.js'): fail('Sanctuary registry loads after bridge')
registry=(site/'guardian-registry.js').read_text(encoding='utf-8')
for name in ('velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara'):
    if "canon:'"+name+"'" not in registry: fail('Guardian registry missing '+name)
state=(site/'majick-state-core.js').read_text(encoding='utf-8')
for marker in ('window.prog=safeProg','window.course=safeCourse',"const SHARED=['xp','crystals','chests']",'bindSharedField'):
    if marker not in state: fail('state core missing '+marker)
for path in (site/'guardian-registry.js',site/'majick-state-core.js',site/'guardian-care-economy.js',site/'v3317-main.js',site/'sanctuary'/'v3317-sanctuary.js'):
    r=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
    if r.returncode: fail(path.name+' syntax: '+r.stderr)
print('STABILITY RESET VERIFY PASSED')
print('single main runtime order:', ' -> '.join(order))
print('ten-Guardian registry verified')
print('shared account state compatibility verified')
