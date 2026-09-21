from pathlib import Path
import json,re,sys,subprocess,tempfile
site=Path(sys.argv[1])
def fail(msg): raise SystemExit('STABILITY RESET VERIFY FAILED: '+msg)
main=(site/'index.html').read_text(encoding='utf-8')
san=(site/'sanctuary'/'index.html').read_text(encoding='utf-8')
for f in ('v3310-ui-compat.js','v3312-ui-compat.js','guardian-registry.js','majick-state-core.js','learning-lab.js','learning-lab.css','learning-plan.js','learning-plan.css','course-tutor.js','course-tutor.css','learn-mode.js','learn-mode.css','magical-college-home.js','magical-college-home.css','guardian-care-economy.js','v3317-main.js','sanctuary/v3317-sanctuary.js','sanctuary/v3320-sanctuary-life.js','sanctuary/v3321-sanctuary-customize.js','v3322-main-recovery.js','sanctuary/v3322-sanctuary-recovery.js','sanctuary/v3325-sanctuary-visual-authority.js'):
    p=site/f
    if not p.exists() or not p.stat().st_size: fail('missing '+f)
for old in ('v3310-main.js','v3312-main.js','v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    if old in main: fail('obsolete main runtime still loaded: '+old)
for old in ('v3311-sanctuary.js','v3312-sanctuary.js','v3313-sanctuary.js','v3314-sanctuary.js','v3315-sanctuary.js'):
    if old in san: fail('obsolete Sanctuary runtime still loaded: '+old)
order=['v3310-ui-compat.js','v3312-ui-compat.js','guardian-registry.js','majick-state-core.js','guardian-care-economy.js','learning-lab.js','learning-plan.js','course-tutor.js','learn-mode.js','v3317-main.js','magical-college-home.js','v3322-main-recovery.js']
pos=[main.find(x) for x in order]
if any(x<0 for x in pos) or pos!=sorted(pos): fail('main runtime load order is wrong')
if san.find('guardian-registry.js')<0 or san.find('v3317-sanctuary.js')<0: fail('Sanctuary registry/bridge missing')
if san.find('guardian-registry.js')>san.find('v3317-sanctuary.js'): fail('Sanctuary registry loads after bridge')
if san.find('v3320-sanctuary-life.js')<0: fail('Sanctuary Home runtime missing')
if san.find('v3317-sanctuary.js')>san.find('v3320-sanctuary-life.js'): fail('Sanctuary Home loads before V3.3.17 bridge')
if san.find('v3321-sanctuary-customize.js')<0: fail('Sanctuary Customization runtime missing')
if san.find('v3320-sanctuary-life.js')>san.find('v3321-sanctuary-customize.js'): fail('Sanctuary Customization loads before Sanctuary Home')
if san.find('v3322-sanctuary-recovery.js')<0: fail('Sanctuary recovery runtime missing')
if san.find('v3321-sanctuary-customize.js')>san.find('v3322-sanctuary-recovery.js'): fail('Sanctuary recovery loads before customization')
if san.find('v3325-sanctuary-visual-authority.js')<0: fail('Guardian visual authority runtime missing')
if san.find('v3322-sanctuary-recovery.js')>san.find('v3325-sanctuary-visual-authority.js'): fail('Guardian visual authority loads before recovery')
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
progress_path=site/'app-progress.json'
if not progress_path.exists(): fail('app-progress.json missing')
try:
    progress=json.loads(progress_path.read_text(encoding='utf-8'))
except Exception as e:
    fail('app-progress.json unreadable: '+str(e))
release=str(progress.get('version') or '').strip()
match=re.search(r'V(\d+\.\d+\.\d+)',release)
if not match: fail('app-progress.json has no semantic release version')
current_version=match.group(1)
if ('V'+current_version) not in main_bridge:
    fail('main bridge does not identify current release '+release)
if 'CANON[' in main_bridge: fail('main bridge still contains fixed Guardian CANON lookup')
if "const meta=registry()?.get?.(p.type);" not in main_bridge: fail('Guardian payload is not registry-driven')
if r'\\nconst canonOf' in main_bridge: fail('escaped newline leaked into JavaScript source')

san_bridge=(site/'sanctuary'/'v3317-sanctuary.js').read_text(encoding='utf-8')
if 'PROTECTED_MOTION_TYPES()' not in san_bridge: fail('Sanctuary motion loop is not registry-driven')
learning=(site/'learning-lab.js').read_text(encoding='utf-8')
for marker in ("window.MajickLearningLab","startVocabGame","calculateExpression","function stats","function renderLesson","function renderMastery"):
    if marker not in learning: fail('Learning Lab missing '+marker)
learning_plan=(site/'learning-plan.js').read_text(encoding='utf-8')
for marker in ("window.MajickLearningPlan","passageList","PERSONAL LEARNING PLAN","Read & Learn"):
    if marker not in learning_plan: fail('Learning Plan missing '+marker)
if 'learning-plan.js?v=3324' not in main or 'learning-plan.css?v=3324' not in main:
    fail('Learning Plan assets are not installed in index.html')
tutor=(site/'course-tutor.js').read_text(encoding='utf-8')
for marker in ("window.MajickCourseTutor","D772_SECTION_ONE","Understanding Data Collection Methods","Recognizing Bias in Data Collection","Unveiling Data Misrepresentations","Conclusions About Data Findings","Needs Review","targetRigor"):
    if marker not in tutor: fail('Course Tutor missing '+marker)
if 'course-tutor.js?v=3326' not in main or 'course-tutor.css?v=3326' not in main:
    fail('Course Tutor assets are not installed in index.html')
learn=(site/'learn-mode.js').read_text(encoding='utf-8')
for marker in ("VERSION='3.3.38'","Teach → Visual → Worked Example","Arcane Anchor Wall","ADAPTIVE REPAIR INSERTED","CAN I DO THIS?"):
    if marker not in learn: fail('Learn Mode missing '+marker)
if 'learn-mode.js?v=3338' not in main or 'learn-mode.css?v=3338' not in main:
    fail('V3.3.38 Learn Mode assets are not installed in index.html')
home=(site/'magical-college-home.js').read_text(encoding='utf-8')
for marker in ("window.MajickCollegeDashboard","MOONLIT COLLEGIUM","ACADEMIC HALL","GUARDIAN HOUSE","ARCANE STUDENT RECORD"):
    if marker not in home: fail('Moonlit Collegium home missing '+marker)
if 'magical-college-home.js?v=3337' not in main or 'magical-college-home.css?v=3337' not in main:
    fail('Moonlit Collegium self-paced home assets are not installed')
for marker in ("tagD772Generated","classifyD772Item","learningPathRepair","multiLesson"):
    if marker not in tutor: fail('D772 item-level notes repair missing '+marker)
if 'learning-lab.js?v=3319' not in main or 'learning-lab.css?v=3319' not in main:
    fail('Learning Lab assets are not installed in index.html')
san_life=(site/'sanctuary'/'v3320-sanctuary-life.js').read_text(encoding='utf-8')
for marker in ("window.MajickSanctuaryLife","v3320BuildHomeHud","v3320SnapDecorItem","guardian-food-bowl","bedAssignments"):
    if marker not in san_life: fail('Sanctuary Home missing '+marker)
if 'v3320-sanctuary-life.js?v=3322-recovery' not in san:
    fail('Sanctuary Home asset is not cache-busted in sanctuary/index.html')
san_custom=(site/'sanctuary'/'v3321-sanctuary-customize.js').read_text(encoding='utf-8')
for marker in ("window.MajickSanctuaryCustomize","v3321SetPlaced","v3321ApplyPreset","v3321BuildFurnitureManager","COZY_DORM"):
    if marker not in san_custom: fail('Sanctuary Customization missing '+marker)
if 'v3321-sanctuary-customize.js?v=3322-recovery' not in san:
    fail('Sanctuary Customization asset is not cache-busted in sanctuary/index.html')
recovery=(site/'v3322-main-recovery.js').read_text(encoding='utf-8')
for marker in ("window.MajickRecoveryUI","window.practiceTopics","window.startGrimoireRaid"):
    if marker not in recovery: fail('main recovery missing '+marker)
san_recovery=(site/'sanctuary'/'v3322-sanctuary-recovery.js').read_text(encoding='utf-8')
for marker in ("window.MajickSanctuaryRecovery","v3322SyncOwnedGuardians","v3322DockGuardianHome"):
    if marker not in san_recovery: fail('Sanctuary recovery missing '+marker)
visual=(site/'sanctuary'/'v3325-sanctuary-visual-authority.js').read_text(encoding='utf-8')
for marker in ("window.MajickGuardianVisualAuthority","v3325SyncOwnedVisuals","v3325BaseScale","totalVisible"):
    if marker not in visual: fail('Guardian visual authority missing '+marker)
for marker in ('majick-state-core.js?v=3322-recovery','guardian-care-economy.js?v=3322-recovery','v3317-main.js?v=3322-recovery','v3322-main-recovery.js?v=3322'):
    if marker not in main: fail('main cache-bust/runtime missing '+marker)
if 'v3322-sanctuary-recovery.js?v=3322' not in san:
    fail('Sanctuary recovery asset is not installed')
if 'v3325-sanctuary-visual-authority.js?v=3325' not in san:
    fail('Guardian visual authority asset is not installed')
care=(site/'guardian-care-economy.js').read_text(encoding='utf-8')
if 'window.MajickGuardianRegistry?.get?.(type)' not in care: fail('Guardian care does not use the shared registry')

for path in (site/'guardian-registry.js',site/'majick-state-core.js',site/'learning-lab.js',site/'learn-mode.js',site/'guardian-care-economy.js',site/'v3317-main.js',site/'sanctuary'/'v3317-sanctuary.js',site/'sanctuary'/'v3320-sanctuary-life.js',site/'sanctuary'/'v3321-sanctuary-customize.js',site/'v3322-main-recovery.js',site/'sanctuary'/'v3322-sanctuary-recovery.js',site/'sanctuary'/'v3325-sanctuary-visual-authority.js'):
    r=subprocess.run(['node','--check',str(path)],capture_output=True,text=True)
    if r.returncode: fail(path.name+' syntax: '+r.stderr)
print('STABILITY RESET VERIFY PASSED')
print('single main runtime order:', ' -> '.join(order))
print('baseline Guardian canon + open-ended future registry verified')
print('shared account state compatibility verified')
