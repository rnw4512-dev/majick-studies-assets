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

# ------------------------------------------------------------------
# MAIN APP: preserve working study features, remove Sanctuary-era bridge wrappers.
# V3.3.17 now owns Sanctuary, stage messaging, Notes Forge navigation and portraits.
# ------------------------------------------------------------------
idx=root/'index.html'
h=idx.read_text(encoding='utf-8')

for js in ('v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'):
    h=re.sub(r'\s*<script[^>]+src=["\']\./'+re.escape(js)+r'[^"\']*["\'][^>]*></script>\s*','\n',h)

for css in ('v3313-main.css','v3314-main.css'):
    h=re.sub(r'\s*<link[^>]+href=["\']\./'+re.escape(css)+r'[^"\']*["\'][^>]*>\s*','\n',h)

# Reinsert one clean V3.3.17 bridge at the end.
h=re.sub(r'\s*<script[^>]+src=["\']\./v3317-main\.js[^"\']*["\'][^>]*></script>\s*','\n',h)
h=h.replace('</body>','<script src="./v3317-main.js?v=3317-clean"></script>\n</body>',1)
idx.write_text(h,encoding='utf-8')

for p in ('v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js','v3313-main.css','v3314-main.css'):
    f=root/p
    if f.exists(): f.unlink()

# ------------------------------------------------------------------
# Release metadata.
# ------------------------------------------------------------------
ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
  'version':'V3.3.17',
  'release_name':'Clean Sanctuary Consolidation + Guardian Repair + Course Realms',
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
    'Manifest furniture uses the base drag/edit/save system.'
  ] + d.get('protected_rules',[])))
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.17 clean runtime sanitizer applied')
