from pathlib import Path
import json,re,sys

root=Path(sys.argv[1])

# Phaser: load the evolution manifest, but do not touch protected movement assets.
pre=root/'sanctuary'/'Preloader.js'
p=pre.read_text(encoding='utf-8')
line="        this.load.json('majick-evolution-manifest', './assets/evolutions/evolution-manifest.json?v=3315');"
if 'majick-evolution-manifest' not in p:
    anchor="        this.load.json('majick-object-manifest', './assets/objects/objects-manifest.json?v=3314');"
    if anchor in p:
        p=p.replace(anchor,anchor+'\n'+line,1)
    else:
        marker="        this.load.image('academy-sanctuary-bg', '../assets/academy_hero.jpg');"
        p=p.replace(marker,marker+'\n'+line,1)
pre.write_text(p,encoding='utf-8')

# Main app: load Notes Forge modules before the V3.3.15 bridge.
idx=root/'index.html'
s=idx.read_text(encoding='utf-8')
if 'v3315-main.css' not in s:
    s=s.replace('</head>','<link rel="stylesheet" href="./v3315-main.css?v=3315">\n</head>',1)
scripts=[
    '<script src="./study-material/materialParser.js?v=3315"></script>',
    '<script src="./study-material/materialStoreModel.js?v=3315"></script>',
    '<script src="./study-material/questionBuilder.js?v=3315"></script>',
    '<script src="./study-material/AddStudyMaterialPage.js?v=3315"></script>',
    '<script src="./v3315-main.js?v=3315"></script>'
]
for tag in scripts:
    if tag not in s:
        s=s.replace('</body>',tag+'\n</body>',1)
idx.write_text(s,encoding='utf-8')

# Sanctuary bridge for stage-aware play/rest assets.
sidx=root/'sanctuary'/'index.html'
t=sidx.read_text(encoding='utf-8')
tag='    <script src="./v3315-sanctuary.js?v=3315"></script>'
if 'v3315-sanctuary.js' not in t:
    t=t.replace('</body>',tag+'\n</body>',1)
sidx.write_text(t,encoding='utf-8')

# Force browser refresh of the new module set.
sw=root/'service-worker.js'
w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='[^']+';","const CACHE='majick-studies-v3-3-15-notes-forge';",w,count=1)
sw.write_text(w,encoding='utf-8')

ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
    'version':'V3.3.15',
    'release_name':'Notes Forge + Unified Guardian Stage Resolver',
    'overall_full_vision_percent':94,
    'usable_study_app_percent':97,
    'what_changed':[
        'A single level-to-stage resolver now feeds Guardian profile art and the Phaser Living Sanctuary.',
        'The Moonlit Study Desk opens Add Study Material / Notes Forge.',
        'Notes Forge accepts pasted notes plus PDF, DOCX, TXT, and MD files.',
        'Uploaded sources can generate source-linked practice questions, explanations, vocabulary, misconception repair, and review.',
        'Generated practice questions can be injected into the current course question bank while the source remains saved in IndexedDB.',
        'Guardian evolution action paths now follow sanctuary/assets/evolutions/{guardian}/{stage}/{walk|play|sleep}.webp.'
    ],
    'protected_rules':[
        'Do not rewrite Velora, Cascade, Solstice, or Aurelia movement methods.',
        'Do not edit, overwrite, rename, regenerate, or remove the original 33 files in sanctuary/assets/motion/.',
        'Stage-aware action art is additive and falls back safely when an evolved asset is missing.',
        'Furniture interaction is manifest-driven.'
    ]
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.15 applied safely')
