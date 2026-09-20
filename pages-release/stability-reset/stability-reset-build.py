from pathlib import Path
import json,re,sys
root=Path(sys.argv[1])
idx=root/'index.html'
san_idx=root/'sanctuary'/'index.html'
h=idx.read_text(encoding='utf-8')
s=san_idx.read_text(encoding='utf-8')

# Stability Reset rule: deployment may remove whole obsolete script tags,
# but it must never rewrite JavaScript function bodies or braces.
def remove_script_tag(text,filename):
    pattern=r'\s*<script[^>]+src=["\'][^"\']*'+re.escape(filename)+r'[^"\']*["\'][^>]*></script>\s*'
    return re.sub(pattern,'\n',text)

for name in ('v3310-main.js','v3312-main.js','v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js','v3310-ui-compat.js','v3312-ui-compat.js','guardian-registry.js','majick-state-core.js','guardian-care-economy.js','v3317-main.js'):
    h=remove_script_tag(h,name)
for name in ('v3311-sanctuary.js','v3312-sanctuary.js','v3313-sanctuary.js','v3314-sanctuary.js','v3315-sanctuary.js','guardian-registry.js','v3317-sanctuary.js'):
    s=remove_script_tag(s,name)

# CSS may be retained from historical releases; only runtime ownership is consolidated.
h=re.sub(r'\s*<link[^>]+href=["\'][^"\']*guardian-care-economy\.css[^"\']*["\'][^>]*>\s*','\n',h)
h=h.replace('</head>','<link rel="stylesheet" href="./guardian-care-economy.css?v=stability-1">\n</head>',1)

# Load order is intentional: preserved UI helpers -> registry -> state -> care -> authoritative bridge.
main_tags='''<script src="./v3310-ui-compat.js?v=stability-1"></script>
<script src="./v3312-ui-compat.js?v=stability-1"></script>
<script src="./guardian-registry.js?v=stability-1"></script>
<script src="./majick-state-core.js?v=stability-1"></script>
<script src="./guardian-care-economy.js?v=stability-1"></script>
<script src="./v3317-main.js?v=stability-1"></script>'''
h=h.replace('</body>',main_tags+'\n</body>',1)

# Sanctuary shares the same registry and keeps only base Game.js + V3.3.10 motion + V3.3.17.
san_tags='''<script src="../guardian-registry.js?v=stability-1"></script>
<script src="./v3317-sanctuary.js?v=stability-1"></script>'''
if '<script src="./bridge.js"></script>' in s:
    s=s.replace('<script src="./bridge.js"></script>',san_tags+'\n<script src="./bridge.js"></script>',1)
else:
    s=s.replace('</body>',san_tags+'\n</body>',1)

idx.write_text(h,encoding='utf-8')
san_idx.write_text(s,encoding='utf-8')

for rel in (
 'sanctuary/v3311-sanctuary.js','sanctuary/v3312-sanctuary.js','sanctuary/v3313-sanctuary.js',
 'sanctuary/v3314-sanctuary.js','sanctuary/v3315-sanctuary.js',
 'v3310-main.js','v3312-main.js','v3313-main.js','v3314-main.js','v3315-main.js','v3316-main.js'
):
    p=root/rel
    if p.exists(): p.unlink()

ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
 'version':'V3.3.18 Stability Reset',
 'release_name':'Stability Reset • Single Runtime Ownership',
 'runtime_architecture':'legacy foundation compiled to one authoritative runtime; no deploy-time JavaScript body rewriting',
 'sanctuary_runtime':'Base Game.js + protected V3.3.10 movement + one V3.3.17 Sanctuary bridge',
 'state_runtime':'MajickStateCore owns shared XP/crystals/chests and safe course progress compatibility',
 'guardian_runtime':'MajickGuardianRegistry contains the current baseline canon and dynamically accepts future Guardians; care is roster-driven by pet.id'
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('Majick Stability Reset build applied without JavaScript body rewriting')
