from pathlib import Path
import json,re,sys

root=Path(sys.argv[1])

# ------------------------------------------------------------------
# SANCTUARY: keep only the known-good base + V3.3.10 movement + clean V3.3.17.
# ------------------------------------------------------------------
sidx=root/'sanctuary'/'index.html'
s=sidx.read_text(encoding='utf-8')

for ver in ('3311','3312','3313','3314','3315'):
    s=re.sub(r'\s*<script[^>]+src=["\']\./v%s-sanctuary\.js[^"\']*["\'][^>]*></script>\s*' % ver,'\n',s)

clean_tag='    <script src="./v3317-sanctuary.js?v=3317-clean"></script>'
s=re.sub(r'\s*<script[^>]+src=["\']\./v3317-sanctuary\.js[^"\']*["\'][^>]*></script>\s*','\n',s)
if '<script src="./bridge.js"></script>' in s:
    s=s.replace('<script src="./bridge.js"></script>',clean_tag+'\n    <script src="./bridge.js"></script>',1)
else:
    s=s.replace('</body>',clean_tag+'\n</body>',1)
sidx.write_text(s,encoding='utf-8')

for ver in ('3311','3312','3313','3314','3315'):
    p=root/'sanctuary'/f'v{ver}-sanctuary.js'
    if p.exists(): p.unlink()

# V3.3.10 keeps the protected movement methods, but its old hot-reload restart
# is not part of movement and can race the Preloader during a normal page load.
v3310=root/'sanctuary'/'v3310-sanctuary.js'
if v3310.exists():
    t=v3310.read_text(encoding='utf-8')
    t=re.sub(
        r"\ntry\s*\{\s*const liveGame=window\.majickPhaserGame;[\s\S]*?console\.warn\('V3\.3\.10 sanctuary restart', e\);\s*\}\s*$",
        "\n",
        t,
        count=1
    )
    v3310.write_text(t,encoding='utf-8')

# ------------------------------------------------------------------
# MAIN APP: preserve working study features, remove Sanctuary-era bridge wrappers.
# V3.3.17 now owns Sanctuary, stage messaging, Notes Forge navigation and portraits.
# ------------------------------------------------------------------
idx=root/'index.html'
h=idx.read_text(encoding='utf-8')

for js in ('v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    h=re.sub(r'\s*<script[^>]+src=["\']\./'+re.escape(js)+r'[^"\']*["\'][^>]*></script>\s*','\n',h)

# ------------------------------------------------------------------
# STUDY STATE HARDENING:
# The legacy inline prog() returned undefined when a newly selected course did
# not yet have a progress row. Study Now then crashed on prog().xp until reload.
# Create the per-course record synchronously before any XP/crystal/streak read.
# ------------------------------------------------------------------
unsafe_prog="function course(){return S.courses[S.activeCourse]||BUILTIN} function prog(){return S.progress[S.activeCourse]}"
safe_prog="""function course(){
  S.courses=S.courses||{PMFC:BUILTIN};
  if(!S.courses[S.activeCourse]){
    S.activeCourse=Object.keys(S.courses)[0]||'PMFC';
  }
  return S.courses[S.activeCourse]||BUILTIN;
}
function prog(){
  S.progress=S.progress||{};
  course();
  let p=S.progress[S.activeCourse];
  if(!p){
    p=S.progress[S.activeCourse]={
      answers:[],explanations:[],repair:[],spacedQueue:[],
      streak:0,lastDay:'',bossWins:0,xp:0,crystals:0,charms:[],chests:0,
      inventory:{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0},
      cosmetics:[],eliminationWins:0,voicePractices:0
    };
  }
  p.answers=Array.isArray(p.answers)?p.answers:[];
  p.explanations=Array.isArray(p.explanations)?p.explanations:[];
  p.repair=Array.isArray(p.repair)?p.repair:[];
  p.spacedQueue=Array.isArray(p.spacedQueue)?p.spacedQueue:[];
  p.charms=Array.isArray(p.charms)?p.charms:[];
  p.inventory=p.inventory||{streakShield:0,clueCharm:0,bossShield:0,oracleTicket:0};
  p.xp=Number(p.xp||0);
  p.crystals=Number(p.crystals||0);
  p.chests=Number(p.chests||0);
  p.streak=Number(p.streak||0);
  return p;
}"""
if unsafe_prog not in h:
    raise RuntimeError('Unsafe legacy prog() signature not found; refusing to publish without state hardening')
h=h.replace(unsafe_prog,safe_prog,1)

# Reinsert Guardian care/economy + one clean V3.3.17 bridge at the end.
h=re.sub(r'\s*<script[^>]+src=["\']\./guardian-care-economy\.js[^"\']*["\'][^>]*></script>\s*','\n',h)
h=re.sub(r'\s*<script[^>]+src=["\']\./v3317-main\.js[^"\']*["\'][^>]*></script>\s*','\n',h)
h=re.sub(r'\s*<link[^>]+href=["\']\./guardian-care-economy\.css[^"\']*["\'][^>]*>\s*','\n',h)
h=h.replace('</head>','<link rel="stylesheet" href="./guardian-care-economy.css?v=3317-care">\n</head>',1)
h=h.replace('</body>','<script src="./guardian-care-economy.js?v=3317-care"></script>\n<script src="./v3317-main.js?v=3317-clean"></script>\n</body>',1)
idx.write_text(h,encoding='utf-8')

for p in ('v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    f=root/p
    if f.exists(): f.unlink()

# ------------------------------------------------------------------
# Release metadata.
# ------------------------------------------------------------------
ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
  'version':'V3.3.17',
  'release_name':'Clean Sanctuary + Guardian Care Economy + Course Realms',
  'overall_full_vision_percent':88,
  'usable_study_app_percent':92,
  'sanctuary_runtime':'Base Game.js + V3.3.10 movement restore + one clean V3.3.17 runtime',
  'removed_from_published_runtime':[
    'v3311-sanctuary.js',
    'v3312-sanctuary.js',
    'v3313-sanctuary.js',
    'v3314-sanctuary.js',
    'v3315-sanctuary.js',
    'v3313-main.js',
    'v3314-main.js',
    'v3315-main.js',
    'v3316-main.js'
  ],
  'protected_rules':list(dict.fromkeys([
    'The original 33 Phase 4 movement files remain untouched.',
    'V3.3.10 remains the only movement-method override layer.',
    'V3.3.17 is the only post-movement Sanctuary runtime.',
    'Final-clean evolution action art remains stage-specific and additive.',
    'Manifest furniture uses the base drag/edit/save system.',
    'Guardian care is roster-driven from actual hatched pet records; eggs stay incubating until hatch.',
    'Moon Crystal purchases and Guardian-care state persist at account level across courses.'
  ] + d.get('protected_rules',[])))
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.17 clean runtime sanitizer applied')
