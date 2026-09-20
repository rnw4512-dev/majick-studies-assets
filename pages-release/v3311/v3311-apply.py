from pathlib import Path
from PIL import Image
import json,re,sys
root=Path(sys.argv[1]); idx=root/'index.html'; s=idx.read_text(encoding='utf-8')
for css in ['v3311-main.css','v3311-plus.css']:
    if css not in s:s=s.replace('</head>',f'<link rel="stylesheet" href="./{css}?v=3311">\n</head>',1)
for js in ['v3311-main.js','v3311-plus.js']:
    if js not in s:s=s.replace('</body>',f'<script src="./{js}?v=3311"></script>\n</body>',1)
s=s.replace('Living Familiars • V3.3.10 Motion Restore','Living Familiars • V3.3.11 Living Grimoire');idx.write_text(s,encoding='utf-8')
sidx=root/'sanctuary'/'index.html';t=sidx.read_text(encoding='utf-8')
if 'v3311-sanctuary.js' not in t:
    needle='<script src="./v3310-sanctuary.js?v=3310"></script>'
    t=t.replace(needle,needle+'\n    <script src="./v3311-sanctuary.js?v=3311"></script>',1) if needle in t else t.replace('<script src="./bridge.js"></script>','<script src="./v3311-sanctuary.js?v=3311"></script>\n    <script src="./bridge.js"></script>',1)
sidx.write_text(t,encoding='utf-8')
b=root/'assets/familiars/evolution_banners';o=root/'assets/familiars/evolution_stages';o.mkdir(parents=True,exist_ok=True)
types=['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara'];st=['new-bond','apprentice','guardian','ascendant','celestial']
for typ in types:
    im=Image.open(b/f'{typ}-evolution.webp').convert('RGB')
    if im.size!=(1800,600):raise RuntimeError(f'{typ} banner size {im.size}')
    for i,n in enumerate(st):im.crop((i*360,80,(i+1)*360,580)).save(o/f'{typ}-{n}.webp','WEBP',quality=92,method=6)
sw=root/'service-worker.js';w=sw.read_text(encoding='utf-8');w=re.sub(r"const CACHE='majick-studies-[^']+';","const CACHE='majick-studies-v3-3-11-living-grimoire';",w,count=1)
extra=['./v3311-main.js','./v3311-main.css','./v3311-plus.js','./v3311-plus.css','./sanctuary/v3311-sanctuary.js']+[f'./assets/familiars/evolution_stages/{t}-{x}.webp' for t in types for x in st]
if 'v3311-plus.js' not in w:
 m=re.search(r"const ASSETS=\[(.*?)\];",w,re.S)
 if m:
  body=m.group(1).rstrip()+','+'\n'+','.join(repr(x) for x in extra);w=w[:m.start(1)]+body+w[m.end(1):]
sw.write_text(w,encoding='utf-8')
p=root/'app-progress.json';d=json.loads(p.read_text())
d.update({'version':'V3.3.11','release_name':'Living Grimoire + Evolution Photo System + Phaser Campus Connections','overall_full_vision_percent':88,'usable_study_app_percent':95,'stable_base':'V3.3.10 Phaser Motion Restore','study_now_changed':False,'study_now_change_note':'No scoring, adaptive selector, question-bank, XP, crystal, streak, answer, course-progress, or current Guardian records changed.','save_compatibility':'Additive defaults only. Existing XP, crystals, streaks, answers, course progress, and Guardian data are preserved.','what_changed':['Free Living Grimoire with page turns, chapter tabs, search, bookmarks, notes, remember flags, clue highlights, glossary, read-aloud, mini-quizzes and mistake repair.','50 stage images generated from the 10 approved evolution banners without redesign.','Automatic level mapping: New Bond 1-2, Apprentice 3-4, Guardian 5-7, Ascendant 8-11, Celestial 12+.','Phaser Campus Connections added around the protected four movers.','Magic Vault and realm cards redesigned for dark-fantasy contrast.'],'known_risks':['A hard refresh may be needed once after deployment.','Cloud persistence waits for the correct Majick Studies Supabase project; the Brooklyn Scholars school database will not be used.']});p.write_text(json.dumps(d,indent=2),encoding='utf-8')
(root/'PROJECT_PROGRESS.md').write_text('# Majick Studies V3.3.11\n\nProtected: Velora, Cascade, Solstice, and Aurelia Phase 4 movement methods and sprite files are unchanged.\n\nAdded: Living Grimoire, 50 evolution stage files from approved banners, campus connections, dark Vault/realm polish, additive save defaults only.\n\nExisting XP, crystals, streaks, answers, course progress, and Guardian data are preserved.\n',encoding='utf-8')
print('V3.3.11 applied')
