from pathlib import Path
import json,re,sys
root=Path(sys.argv[1])
idx=root/'index.html';s=idx.read_text(encoding='utf-8')
if 'v3313-main.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="./v3313-main.css?v=3313">\n</head>',1)
if 'v3313-main.js' not in s:s=s.replace('</body>','<script src="./v3313-main.js?v=3313"></script>\n</body>',1)
s=s.replace('Living Familiars • V3.3.12 Faster Evolutions','Living Familiars • V3.3.13 Sanctuary Restore')
idx.write_text(s,encoding='utf-8')

# Load the nine optional object textures. 404s fall back to the existing drawn furniture.
pre=root/'sanctuary'/'Preloader.js';p=pre.read_text(encoding='utf-8')
marker="        this.load.image('academy-sanctuary-bg', '../assets/academy_hero.jpg');"
block="""        this.load.image('academy-sanctuary-bg', '../assets/academy_hero.jpg');

        // V3.3.13 optional final sanctuary art. Missing files do not affect familiar motion.
        const objectBase = './assets/objects/';
        this.load.image('obj-arcane-stacks', objectBase + 'arcane-stacks.webp?v=3313');
        this.load.image('obj-moonlit-study-desk', objectBase + 'moonlit-study-desk.webp?v=3313');
        this.load.image('obj-observatory-telescope', objectBase + 'observatory-telescope.webp?v=3313');
        this.load.image('obj-crystal-focus-pedestal', objectBase + 'crystal-focus-pedestal.webp?v=3313');
        this.load.image('obj-moonstone-crystal-bed', objectBase + 'moonstone-crystal-bed.webp?v=3313');
        this.load.image('obj-amethyst-crystal-bed', objectBase + 'amethyst-crystal-bed.webp?v=3313');
        this.load.image('obj-study-apothecary', objectBase + 'study-apothecary.webp?v=3313');
        this.load.image('obj-familiar-lounge', objectBase + 'familiar-lounge.webp?v=3313');
        this.load.image('obj-magic-mirror', objectBase + 'magic-mirror.webp?v=3313');"""
if 'obj-arcane-stacks' not in p:p=p.replace(marker,block,1)
pre.write_text(p,encoding='utf-8')

sidx=root/'sanctuary'/'index.html';t=sidx.read_text(encoding='utf-8')
if 'v3313-sanctuary.js' not in t:
    needle='<script src="./v3312-sanctuary.js?v=3312"></script>'
    t=t.replace(needle,needle+'\n    <script src="./v3313-sanctuary.js?v=3313"></script>',1)
sidx.write_text(t,encoding='utf-8')

sw=root/'service-worker.js';w=sw.read_text(encoding='utf-8')
w=re.sub(r"const CACHE='[^']+';","const CACHE='majick-studies-v3-3-13-sanctuary-restore';",w,count=1)
# Keep heavy Phaser/object/evolution art demand-loaded.
sw.write_text(w,encoding='utf-8')

ap=root/'app-progress.json';d=json.loads(ap.read_text())
d.update({
 'version':'V3.3.13',
 'release_name':'Sanctuary Restore + Object Art Ready',
 'overall_full_vision_percent':91,
 'usable_study_app_percent':96,
 'stable_base':'V3.3.12 Faster Evolutions with V3.3.10 protected Phaser motion foundation',
 'study_now_changed':False,
 'study_now_change_note':'No Study Now question, scoring, difficulty, XP, crystal, streak, answer, or course-progress logic changed.',
 'save_compatibility':'Additive-only. Existing XP, crystals, streaks, answers, course progress, Guardians, and sanctuary movement saves are preserved.',
 'what_changed':[
   'Home no longer displays fake static portrait pets as if they were the Phaser sanctuary; it now has a clear portal into the real sanctuary.',
   'Companions loads the real Phaser 4 sanctuary directly again.',
   'Evolution image URLs are cache-busted so stale earlier crops/text cannot remain stuck in browser cache.',
   'Legacy Phaser name/type labels are continuously hidden so text such as Moon cannot sit over a familiar head.',
   'Nine optional transparent sanctuary object textures are wired into Phaser with automatic fallback to the existing drawn furniture until files are uploaded.',
   'Magic Mirror is now a real Phaser interaction linked to current readiness, answers, crystals, and Study Now.'
 ],
 'protected_rules':[
   'No rewriting Velora, Cascade, Solstice, or Aurelia movement methods.',
   'No replacing their original sprite files.',
   'No simplifying their movement art.',
   'Future work continues around the confirmed movement system.'
 ],
 'next_priorities':[
   'Upload the nine WebP object files to sanctuary/assets/objects/.',
   'Visually tune object scale/placement after the real art is live.',
   'Add evolution aura effects around moving sprites without changing their animation frames.'
 ]
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
(root/'PROJECT_PROGRESS.md').write_text("""# Majick Studies V3.3.13 — Sanctuary Restore + Object Art Ready

## Protected hard rule
Velora, Cascade, Solstice, and Aurelia movement methods and original sprite files remain untouched.

## Fixed
- Real Phaser sanctuary restored directly on Companions.
- Home fake/static sanctuary portraits removed and replaced with a portal.
- Evolution images cache-busted.
- Old text labels over Phaser familiar heads suppressed.
- Nine sanctuary object assets are wired and will activate automatically when uploaded.
- Magic Mirror opens real study-progress actions.

## Save safety
No destructive migration. XP, crystals, streaks, answers, course progress, Guardian data, and sanctuary movement saves are preserved.
""",encoding='utf-8')
print('V3.3.13 applied safely')
