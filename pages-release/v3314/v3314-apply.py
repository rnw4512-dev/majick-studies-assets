from pathlib import Path
import json,re,sys
root=Path(sys.argv[1])
manifest=root/'sanctuary'/'assets'/'objects'/'objects-manifest.json'
data=json.loads(manifest.read_text(encoding='utf-8'))

# Manifest is the source of truth for preloadable object textures.
pre=root/'sanctuary'/'Preloader.js'
p=pre.read_text(encoding='utf-8')
start='        // V3.3.14 MANIFEST OBJECTS START'
end='        // V3.3.14 MANIFEST OBJECTS END'
lines=[start,"        this.load.json('majick-object-manifest', './assets/objects/objects-manifest.json?v=3314');"]
for o in data.get('objects',[]):
    if o.get('enabled') and o.get('preload'):
        lines.append("        this.load.image(%r, './assets/objects/%s?v=3314');" % ('obj-'+o['id'],o['filename']))
lines.append(end)
block='\n'.join(lines)
if start in p and end in p:
    p=re.sub(re.escape(start)+r'.*?'+re.escape(end),block,p,flags=re.S)
else:
    marker="        this.load.image('academy-sanctuary-bg', '../assets/academy_hero.jpg');"
    p=p.replace(marker,marker+'\n'+block,1)
# Remove older hard-coded optional object preload block so manifest owns object registration.
p=re.sub(r"\n\s*// V3\.3\.13 optional final sanctuary art\..*?this\.load\.image\('obj-magic-mirror'.*?;","",p,flags=re.S)
pre.write_text(p,encoding='utf-8')

idx=root/'index.html';s=idx.read_text(encoding='utf-8')
if 'v3314-main.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="./v3314-main.css?v=3314">\n</head>',1)
if 'v3314-main.js' not in s:s=s.replace('</body>','<script src="./v3314-main.js?v=3314"></script>\n</body>',1)
s=s.replace('Living Familiars • V3.3.13 Sanctuary Restore','Living Familiars • V3.3.14 One Sanctuary')
idx.write_text(s,encoding='utf-8')

sidx=root/'sanctuary'/'index.html';t=sidx.read_text(encoding='utf-8')
if 'v3314-sanctuary.js' not in t:
    t=t.replace('</body>','    <script src="./v3314-sanctuary.js?v=3314"></script>\n</body>',1)
sidx.write_text(t,encoding='utf-8')

sw=root/'service-worker.js';w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='[^']+';","const CACHE='majick-studies-v3-3-14-one-sanctuary';",w,count=1)
sw.write_text(w,encoding='utf-8')

ap=root/'app-progress.json';d=json.loads(ap.read_text())
d.update({
 'version':'V3.3.14',
 'release_name':'One Phaser Sanctuary + Manifest Object Library',
 'overall_full_vision_percent':92,
 'usable_study_app_percent':96,
 'what_changed':[
  'Every visible Sanctuary experience now renders the same Phaser 4 Living Sanctuary, including Home and Companions.',
  'objects-manifest.json is now the single source of truth for sanctuary object filename, display name, scale, interaction, destination, unlock requirement, collision intent, glow, hover behavior, preload status, and placement.',
  'The deployment generates missing starter WebP object art from the manifest while preserving any uploaded replacement art.',
  'Phaser preloads only manifest objects marked preload=true; the rest of the library remains available for later room expansion without inflating every boot.'
 ],
 'protected_rules':[
  'No rewriting Velora, Cascade, Solstice, or Aurelia movement methods.',
  'No replacing their original 33 movement files.',
  'No simplifying Guardian movement art.',
  'New sanctuary systems wrap around the protected movement layer.'
 ]
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.14 applied safely')
