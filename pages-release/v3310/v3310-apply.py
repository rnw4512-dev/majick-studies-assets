from pathlib import Path
import json,re,sys
root=Path(sys.argv[1])
idx=root/'index.html'
s=idx.read_text(encoding='utf-8')
if 'v3310-main.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="./v3310-main.css?v=3310">\n</head>',1)
if 'v3310-main.js' not in s:s=s.replace('</body>','<script src="./v3310-main.js?v=3310"></script>\n</body>',1)
s=s.replace('Living Familiars • V3.3.9 Dark Collegium','Living Familiars • V3.3.10 Motion Restore').replace('Majick Studies — Dark Collegium','Majick Studies — Dark Collegium Motion Restore')
idx.write_text(s,encoding='utf-8')

sidx=root/'sanctuary'/'index.html'
t=sidx.read_text(encoding='utf-8')
if 'v3310-sanctuary.js' not in t:t=t.replace('<script src="./bridge.js"></script>','<script src="./v3310-sanctuary.js?v=3310"></script>\n    <script src="./bridge.js"></script>',1)
t=t.replace('✦ Awakening the Living Sanctuary…','✦ Awakening the Dark Collegium…').replace('Majick Studies • Dark Collegium Living Sanctuary','Majick Studies • Dark Collegium • Motion Restore')
sidx.write_text(t,encoding='utf-8')

sw=root/'service-worker.js'; w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='majick-studies-[^']+';","const CACHE='majick-studies-v3-3-10-motion-restore';",w,count=1)
extra=['./v3310-main.js','./v3310-main.css','./sanctuary/v3310-sanctuary.js']+[f'./sanctuary/assets/motion/{x}' for x in [
'luna-idle.png','luna-walk-1.png','luna-walk-2.png','luna-hop.png','ember-idle.png','ember-walk-1.png','ember-walk-2.png','ember-hop.png','ember-slither-1.png','ember-slither-2.png','ember-sit.png','ember-sleep.png','nova-walk-1.png','nova-walk-2.png','nova-run.png','nova-hop.png','nova-paw.png','nova-spin.png','nova-sit.png','nova-sleep.png','nova-pounce.png','nova-pounce2.png','nova-pounce3.png','mallow-idle.png','mallow-hop-1.png','mallow-hop-2.png','mallow-fly-1.png','mallow-fly-2.png','mallow-paw.png','mallow-sit.png','mallow-sleep.png','mallow-land.png','mallow-binky.png']]
if 'v3310-main.js' not in w:
    m=re.search(r"const ASSETS=\[(.*?)\];",w,re.S)
    if m:
        body=m.group(1).rstrip(); body+=((',' if body and not body.endswith(',') else '')+'\n'+','.join(repr(x) for x in extra)); w=w[:m.start(1)]+body+w[m.end(1):]
sw.write_text(w,encoding='utf-8')

p=root/'app-progress.json'
try:d=json.loads(p.read_text())
except:d={}
d.update({'version':'V3.3.10','release_name':'Phaser Motion Restore + Dark Collegium Visual Pass','overall_full_vision_percent':84,'usable_study_app_percent':93,'stable_base':'V3.3.9 Dark Collegium on permanent GitHub Pages','study_now_changed':False,'study_now_change_note':'No scoring or adaptive-selector rewrite in this patch; sanctuary motion/presentation and canon non-Phaser visuals only.','save_compatibility':'No destructive migration. Existing GitHub Pages localStorage progress remains primary.','what_changed':['Preserved every original Phase 4 movement PNG unchanged.','Added staggered opening patrols, travel-biased autonomous behavior and a stall watchdog.','Raised moving guardians above furniture so their animation remains visible.','Expanded the sanctuary into a darker botanical magical-college room with moonlit observatory, library walls, fireplace, desk, apothecary, telescope, focus crystals, lounge and two crystal beds.','Precached all Phase 4 motion PNGs on the same Pages origin.','Replaced remaining old/simple non-Phaser guardian displays in Study Now and the mini habitat with canon portraits.'],'next_priorities':['Verify the four original movers visibly patrol in the live sanctuary.','Continue richer study-earned furniture/art replacements.','Create exact-design movement sets for the six newer guardians without altering the original four.']})
p.write_text(json.dumps(d,indent=2),encoding='utf-8')
(root/'PROJECT_PROGRESS.md').write_text('''# Majick Studies Project Progress — V3.3.10

**Release:** Phaser Motion Restore + Dark Collegium Visual Pass  
**Stable base:** V3.3.9 on permanent GitHub Pages  
**Full vision:** ~84%  
**Usable study app:** ~93%

## What changed
- Preserved the original four Phase 4 sprite sets exactly; no moving art was simplified, regenerated or replaced.
- Added visible opening patrols, stronger travel behavior, a stall watchdog and depth repair so the hand-built sprites stay moving and visible.
- Precached all existing motion PNGs from the same Pages origin.
- Expanded the sanctuary toward the requested dark botanical magical-college look with moonlit library architecture, fireplace, observatory, apothecary, study furniture and two crystal beds.
- Replaced remaining old/simple non-Phaser Study Now and habitat graphics with the approved canon portraits.

## Study Now / save compatibility
Study Now scoring and the V3.3.9 adaptive selector are unchanged. Existing browser progress remains primary; there is no destructive migration.

## Next priorities
1. Verify Velora, Cascade, Solstice and Aurelia visibly patrol in the live sanctuary.
2. Continue the collectible furniture/art pass.
3. Build exact-design movement sets for the six newer guardians without touching the original four.
''',encoding='utf-8')
print('V3.3.10 deploy layer applied')
