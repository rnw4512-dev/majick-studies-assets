from pathlib import Path
import json,re,sys

root=Path(sys.argv[1])

idx=root/'index.html'
s=idx.read_text(encoding='utf-8')
if 'v3316-main.css' not in s:
    s=s.replace('</head>','<link rel="stylesheet" href="./v3316-main.css?v=3316">\n</head>',1)
scripts=[
    '<script src="./courseManager.js?v=3316"></script>',
    '<script src="./v3316-main.js?v=3316"></script>'
]
for tag in scripts:
    if tag not in s:
        s=s.replace('</body>',tag+'\n</body>',1)
idx.write_text(s,encoding='utf-8')

sw=root/'service-worker.js'
w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='[^']+';","const CACHE='majick-studies-v3-3-16-course-realms';",w,count=1)
sw.write_text(w,encoding='utf-8')

ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
  'version':'V3.3.16',
  'release_name':'Course Realms + Guardian Art Repair',
  'overall_full_vision_percent':95,
  'usable_study_app_percent':97,
  'what_changed':[
    'Each course now keeps its own academic record: notes, generated questions, answers, mistakes, mastery, readiness, repair queue, and study streak.',
    'Majick account XP and Guardian growth persist across courses; a newly created course starts with a fresh class streak.',
    'Study Material now includes a Course Center for starting a new WGU course and marking a course passed.',
    'Passing a course records completion, awards 500 Majick XP once, and shows a course-completion celebration.',
    'Approved five-stage Guardian art is restored for sidebar/profile screens; walk/play/sleep action art remains Phaser-only.',
    'Evolution action WebPs are normalized during deployment so transparent margins no longer make Guardians tiny or blank.',
    'Home Sanctuary replacement is strengthened so the real Phaser Living Sanctuary replaces legacy habitat panels.'
  ],
  'protected_rules':[
    'Do not rewrite the original Guardian movement methods.',
    'Do not edit, overwrite, rename, regenerate, or remove the original 33 files in sanctuary/assets/motion/.',
    'Academic data from one course must never be surfaced as progress, notes, questions, mistakes, mastery, or streak data for another course.',
    'Account XP and Guardian growth may persist across courses because they represent the learner, not a class.'
  ]
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.16 applied safely')
