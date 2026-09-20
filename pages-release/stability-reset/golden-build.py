from pathlib import Path
import hashlib, json, os, shutil, sys, zipfile

repo=Path(sys.argv[1]).resolve()
site=Path(sys.argv[2]).resolve()
archive=Path(sys.argv[3]).resolve()
manifest_path=Path(sys.argv[4]).resolve()
files_path=Path(sys.argv[5]).resolve()

def fail(msg):
    raise SystemExit("GOLDEN BUILD FAILED: "+msg)

def sha256(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""):
            h.update(chunk)
    return h.hexdigest()

manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
if manifest.get("runtime_version")!="3.3.18-stability":
    fail("unexpected baseline runtime version")
actual_archive_sha=sha256(archive)
if actual_archive_sha!=manifest.get("golden_zip_sha256"):
    fail("Golden Baseline archive hash mismatch")

if site.exists():
    shutil.rmtree(site)
site.mkdir(parents=True)

site_root=site.resolve()
with zipfile.ZipFile(archive) as z:
    for info in z.infolist():
        target=(site/info.filename).resolve()
        if target!=site_root and site_root not in target.parents:
            fail("unsafe ZIP path: "+info.filename)
    z.extractall(site)

count=0
for raw in files_path.read_text(encoding="utf-8").splitlines():
    if not raw.strip():
        continue
    expected, rel=raw.split(None,1)
    rel=rel.strip()
    if rel.startswith("*"):
        rel=rel[1:]
    if rel.startswith("./"):
        rel=rel[2:]
    p=site/rel
    if not p.is_file():
        fail("baseline file missing after extraction: "+rel)
    if sha256(p)!=expected:
        fail("baseline file hash mismatch: "+rel)
    count+=1
if count!=int(manifest.get("file_count",0)):
    fail(f"baseline file count mismatch: verified {count}")

index=site/"index.html"
progress=site/"app-progress.json"
if not index.exists() or index.stat().st_size==0:
    fail("baseline index.html is missing")
if not progress.exists():
    fail("baseline app-progress.json is missing")
baseline_progress=json.loads(progress.read_text(encoding="utf-8"))
if baseline_progress.get("version")!="V3.3.18 Stability Reset":
    fail("baseline app-progress version is not V3.3.18 Stability Reset")
for required in ("guardian-registry.js?v=stability-1","majick-state-core.js?v=stability-1","guardian-care-economy.js?v=stability-1","v3317-main.js?v=stability-1"):
    if required not in index.read_text(encoding="utf-8"):
        fail("baseline index is missing runtime script: "+required)

OVERLAYS=[
    ("pages-release/stability-reset/v3310-ui-compat.js","v3310-ui-compat.js"),
    ("pages-release/stability-reset/v3312-ui-compat.js","v3312-ui-compat.js"),
    ("pages-release/stability-reset/guardian-registry.js","guardian-registry.js"),
    ("pages-release/stability-reset/majick-state-core.js","majick-state-core.js"),
    ("pages-release/v3319/learning-lab.js","learning-lab.js"),
    ("pages-release/v3319/learning-lab.css","learning-lab.css"),
    ("pages-release/v3324/learning-plan.js","learning-plan.js"),
    ("pages-release/v3324/learning-plan.css","learning-plan.css"),
    ("pages-release/v3326/course-tutor.js","course-tutor.js"),
    ("pages-release/v3326/course-tutor.css","course-tutor.css"),
    ("pages-release/v3315/study-material/materialParser.js","study-material/materialParser.js"),
    ("pages-release/v3315/study-material/materialStoreModel.js","study-material/materialStoreModel.js"),
    ("pages-release/v3315/study-material/questionBuilder.js","study-material/questionBuilder.js"),
    ("pages-release/v3315/study-material/AddStudyMaterialPage.js","study-material/AddStudyMaterialPage.js"),
    ("pages-release/v3316/courseManager.js","courseManager.js"),
    ("pages-release/v3317/guardian-care-economy.js","guardian-care-economy.js"),
    ("pages-release/v3317/guardian-care-economy.css","guardian-care-economy.css"),
    ("pages-release/v3317/v3317-main.js","v3317-main.js"),
    ("pages-release/v3317/v3317-sanctuary.js","sanctuary/v3317-sanctuary.js"),
    ("pages-release/v3320/sanctuary-life.js","sanctuary/v3320-sanctuary-life.js"),
    ("pages-release/v3321/sanctuary-customize.js","sanctuary/v3321-sanctuary-customize.js"),
    ("pages-release/v3322/main-recovery.js","v3322-main-recovery.js"),
    ("pages-release/v3322/sanctuary-recovery.js","sanctuary/v3322-sanctuary-recovery.js"),
    ("pages-release/v3325/sanctuary-visual-authority.js","sanctuary/v3325-sanctuary-visual-authority.js"),
]
for src_rel,dst_rel in OVERLAYS:
    src=repo/src_rel
    dst=site/dst_rel
    if not src.is_file():
        fail("current overlay missing: "+src_rel)
    dst.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(src,dst)
    if sha256(src)!=sha256(dst):
        fail("overlay copy mismatch: "+dst_rel)

PINNED_MOTION={
"luna-idle.png":("luna-idle.png","f7cb2e45548f7029f977d524af9f198d2c6814a5bf185061e44771bed6f52c6e",2045015),
"luna-walk-1.png":("luna-walk-1.png","d4d4cab37605394ec461633d1e11e5c2d9fe0923802460121a3ca0aead2c2c9b",1971787),
"luna-walk-2.png":("luna-walk-2.png","bee5011fa38d651506cf581924392d33f3c104d7dbc843fb629da1b6e84fde5d",2013907),
"luna-hop.png":("luna-hop.png","17de7d2d5598f6b6cab2dd8c8c0df8d818ff70af5d61e0c1ecbb988e4100e58f",2023428),
"ember-idle.png":("ember-idle.png","faeef552b08afcc1491b7a82c4fd284558e81a40c4a5b361fbfcb75460970062",2019581),
"ember-walk-1.png":("ember-walk-1.png","7a132717e819793584d51539ebf6d34acf6ea48682bbef414f18685245900b2a",1936606),
"ember-walk-2.png":("ember-walk-2.png","023125c8c7226849f22b47233d5c96ed4148607ee973efb3c64ab90bd646581f",1790674),
"ember-hop.png":("ember-hop.png","0198a4fa97d89122c306fffc9f38426accf5ac08edc925e6285175bdba97eb04",1880810),
"ember-slither-1.png":("ember-slither-1.png","52c4c9db11f87b7a3949b44224ad10a3b19968457d3e343ab9d566eba927d298",1906991),
"ember-slither-2.png":("ember-slither-2.png","77622a6d80fadc4538e882142f6fc8a38be65c5a5c38bb77d801e0081fbe7b9a",1940422),
"ember-sit.png":("ember-sit.png","461a818636f6130d8e1870a1b81a86c69933b41056d60a299b3fb2a40e228a2e",1782157),
"ember-sleep.png":("ember-sleep.png","36e98f9f74daf3c5a42c093cbbe5fd3ae8e1fe526fdf9d6cc21de581c45b38ed",2044841),
"nova-walk-1.png":("nova-walk-1.png","28f6c033c4e0936238ba940e7eb8d738b52fc1cc0c41d7221ceb99ff65dde8a0",1936034),
"nova-walk-2.png":("nova-walk-2.png","563baabb39555c54101966b6147e7225da5a77c95c2d2ce4a45dce746eb03d39",1907984),
"nova-run.png":("nova-run.png","551c16a72854f1d3f0944182f66e655be7958b52f081701e777d17510898085b",1764201),
"nova-hop.png":("nova-hop.png","ec2a99c37bf64f9e175a72305c7948a40beb7fd6f66b6673d2c26d4abaaf4457",1808102),
"nova-paw.png":("nova-paw.png","52a39fc30ba13231f89168bc78bef64ff51f0dffbc2bb63312373d926e7c1df3",1908514),
"nova-spin.png":("nova-spin.png","0ac61061bdb38c99d9bcd2dcf1a8aa8fcea0c2c2b5d35ec70b5f3eb2e54f3abe",1819547),
"nova-sit.png":("nova-sit.png","9daf1996bf6483afc60784eae9fce1b2c6d91026d993c908d5046183905e4ba4",1608278),
"nova-sleep.png":("nova-sleep.png","5fd788a2ef20ffe910e663a8dd6e58acf42c16bc25cb1b9e171957bdce784f69",2014887),
"nova-pounce.png":("nova-pounce.png","54788c79448bc5bf97b6777f8edad70737ff4f11fb084882f93b77afefcae852",1617633),
"nova-pounce2.png":("nova-pounce2.png","a10fac4597ab37b7493a2009321b41ed93dda950c0cb5e48233ba3cfb507e53b",1915520),
"nova-pounce3.png":("nova-pounce3.png","d443934193a7da1d3639bd18fdb346ccf97602003c7ca5330a55d6f62b1fe4bc",1853805),
"mallow-idle.png":("mallow-idle.png","a504ae78e4e24f193f5bbf4986c09b71b56eebb143c94e7d36fdf9915fa44187",1170777),
"mallow-hop-1.png":("mallow-hop-1.png","30dea2990100ef8afcbe3162bde65cb316025bea9b1234fcd4d365c44732f22e",1271466),
"mallow-hop-2.png":("mallow-hop-2.png","e1e9fdfce11ab5182714c7bb43e6e4b5c324843e610b0801e10fdf8a9628c8c2",1206136),
"mallow-fly 1.png":("mallow-fly-1.png","7261ddf29ffd119cecb66c3fb6216b1c26789733e53dfd8b18ed6e90b4c1578c",1195426),
"mallow-fly 2.png":("mallow-fly-2.png","1877290e8862096bb89784bc8206a77c64f4c2225430b4d37c0e7d32685d1243",1066737),
"mallow-paw.png":("mallow-paw.png","2b9d8173f9fa871b4bd7f537713dcf65a97386f01e631ecc727802c9dc9991eb",1310126),
"mallow-sit.png":("mallow-sit.png","953d6c0f1d2d84614231ce5e2e6ae51cf99b1f487eea08790d8e5a2af68c2e43",1300052),
"mallow-sleep.png":("mallow-sleep.png","b167a94a26d0acc3716c4dfe7c294f6a0501a1ef810854ac210c22a443473c47",1195403),
"mallow-land.png":("mallow-land.png","ffe58378d479aa57b639c480e66abfa92a0705890e47abd6a135e4900779b71a",1183826),
"mallow-binky.png":("mallow-binky.png","8e1cae83b9d5de334696b61cebdb65994e96967079f0ca6a67bc73cf82f13d34",1170610),
}
if len(PINNED_MOTION)!=33:
    fail("protected motion pin set must contain exactly 33 files")

motion=site/"sanctuary/assets/motion"
runtime_motion=site/"sanctuary/assets/runtime-motion"
shutil.rmtree(motion,ignore_errors=True)
shutil.rmtree(runtime_motion,ignore_errors=True)
motion.mkdir(parents=True,exist_ok=True)

for src_name,(dst_name,expected_hash,expected_bytes) in PINNED_MOTION.items():
    src=repo/src_name
    if not src.is_file():
        fail("protected motion source missing: "+src_name)
    if src.stat().st_size!=expected_bytes:
        fail("protected motion source byte size changed: "+src_name)
    if sha256(src)!=expected_hash:
        fail("protected motion source hash changed: "+src_name)
    dst=motion/dst_name
    shutil.copyfile(src,dst)
    if sha256(dst)!=expected_hash:
        fail("protected motion deployment changed bytes: "+dst_name)

progress=site/"app-progress.json"
if progress.exists():
    data=json.loads(progress.read_text(encoding="utf-8"))
    data["version"]="V3.3.26 Majick Course Tutor"
    data["learning_intelligence"]="V3.3.26 course tutor with section/lesson learning paths, note-driven chapters, lesson mastery states, rigor progression, repair loops, ~100-question adaptive course bank and D772 statistics tools"
    data["sanctuary_version"]="V3.3.25 Single Guardian Visual Authority"
    data["sanctuary_home"]="Guardian needs HUD, object-aware care travel, exclusive beds, visible care inventory, safe furniture snapping"
    data["sanctuary_customization"]="personal Guardian nooks, feeding/play zones, owned furniture storage, Cozy Dorm layout preset"
    data["build_foundation"]="V3.3.18 Golden Baseline"
    data["golden_baseline_source_commit"]=manifest.get("source_commit")
    data["golden_baseline_source_run_id"]=manifest.get("source_run_id")
    data["historical_patch_chain"]="retired from deployment"
    data["current_overlay_commit"]=os.environ.get("GITHUB_SHA","")
    progress.write_text(json.dumps(data,indent=2),encoding="utf-8")

index=site/"index.html"
html=index.read_text(encoding="utf-8")
html=html.replace('<link rel="stylesheet" href="./learning-lab.css?v=3319">','').replace('<link rel="stylesheet" href="./learning-plan.css?v=3324">','').replace('<link rel="stylesheet" href="./course-tutor.css?v=3326">','').replace('<script src="./learning-lab.js?v=3319"></script>','').replace('<script src="./learning-plan.js?v=3324"></script>','').replace('<script src="./course-tutor.js?v=3326"></script>','').replace('<script src="./v3322-main-recovery.js?v=3322"></script>','')
html=html.replace('./guardian-care-economy.css?v=stability-1','./guardian-care-economy.css?v=3322-recovery')
html=html.replace('./majick-state-core.js?v=stability-1','./majick-state-core.js?v=3322-recovery')
html=html.replace('./guardian-care-economy.js?v=stability-1','./guardian-care-economy.js?v=3322-recovery')
html=html.replace('./v3317-main.js?v=stability-1','./v3317-main.js?v=3322-recovery')
html=html.replace('</head>','<link rel="stylesheet" href="./learning-lab.css?v=3319">\\n<link rel="stylesheet" href="./learning-plan.css?v=3324">\\n<link rel="stylesheet" href="./course-tutor.css?v=3326">\\n</head>',1)
main_tag='<script src="./v3317-main.js?v=3322-recovery"></script>'
if main_tag not in html:
    fail("authoritative main runtime tag missing while installing recovery")
html=html.replace(main_tag,'<script src="./learning-lab.js?v=3319"></script>\\n<script src="./learning-plan.js?v=3324"></script>\\n<script src="./course-tutor.js?v=3326"></script>\\n'+main_tag+'\\n<script src="./v3322-main-recovery.js?v=3322"></script>',1)
index.write_text(html,encoding="utf-8")

san_index=site/"sanctuary"/"index.html"
san_html=san_index.read_text(encoding="utf-8")
san_html=san_html.replace('<script src="./v3320-sanctuary-life.js?v=3320"></script>','').replace('<script src="./v3321-sanctuary-customize.js?v=3321"></script>','').replace('<script src="./v3322-sanctuary-recovery.js?v=3322"></script>','').replace('<script src="./v3325-sanctuary-visual-authority.js?v=3325"></script>','')
san_html=san_html.replace('../guardian-registry.js?v=stability-1','../guardian-registry.js?v=3322-recovery')
san_html=san_html.replace('./v3317-sanctuary.js?v=stability-1','./v3317-sanctuary.js?v=3322-recovery')
san_tag='<script src="./v3317-sanctuary.js?v=3322-recovery"></script>'
if san_tag not in san_html:
    fail("authoritative Sanctuary runtime tag missing while installing Sanctuary recovery")
san_html=san_html.replace(san_tag,san_tag+'\\n<script src="./v3320-sanctuary-life.js?v=3322-recovery"></script>\\n<script src="./v3321-sanctuary-customize.js?v=3322-recovery"></script>\\n<script src="./v3322-sanctuary-recovery.js?v=3322"></script>\\n<script src="./v3325-sanctuary-visual-authority.js?v=3325"></script>',1)
san_index.write_text(san_html,encoding="utf-8")

(site/".nojekyll").touch()
print("GOLDEN BASELINE BUILD PREPARED")
print("baseline archive sha256:",actual_archive_sha)
print("baseline files verified:",count)
print("current overlays applied:",len(OVERLAYS))
print("protected motion verified:",len(PINNED_MOTION))
