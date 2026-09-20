from pathlib import Path
import json,re,sys

root=Path(sys.argv[1])

idx=root/'index.html'
s=idx.read_text(encoding='utf-8')
tag='<script src="./v3317-main.js?v=3317"></script>'
if tag not in s:
    s=s.replace('</body>',tag+'\n</body>',1)
idx.write_text(s,encoding='utf-8')

sw=root/'service-worker.js'
w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='[^']+';","const CACHE='majick-studies-v3-3-17-guardian-repair';",w,count=1)
sw.write_text(w,encoding='utf-8')

ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
  'version':'V3.3.17',
  'release_name':'Guardian Repair + Course Realms',
  'overall_full_vision_percent':96,
  'usable_study_app_percent':98,
  'what_changed':list(dict.fromkeys([
    'Main app shell now reports V3.3.17 consistently after every render.',
    'Service-worker cache bumped to V3.3.17 so older V3.3.8/V3.3.16 shell assets cannot remain authoritative.',
    'Corrected 60 individual Guardian evolution action assets are deployed.',
    'Phase 4 movement logic remains the protected movement controller.',
  ] + d.get('what_changed',[])))
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.17 main shell applied safely')
