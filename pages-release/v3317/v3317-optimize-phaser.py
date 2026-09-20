from pathlib import Path
from PIL import Image
import re,sys,shutil

root=Path(sys.argv[1])
san=root/'sanctuary'
motion=san/'assets'/'motion'
objects=san/'assets'/'objects'
runtime_motion=san/'assets'/'runtime-motion'
runtime_objects=san/'assets'/'runtime-objects'

for p in (runtime_motion,runtime_objects):
    if p.exists(): shutil.rmtree(p)
    p.mkdir(parents=True,exist_ok=True)

def convert(src,dst,max_dim,quality=82):
    with Image.open(src) as im:
        im=im.convert('RGBA')
        im.thumbnail((max_dim,max_dim),Image.Resampling.LANCZOS)
        dst.parent.mkdir(parents=True,exist_ok=True)
        im.save(dst,'WEBP',quality=quality,method=4)

# Protected originals remain untouched. Phaser loads these derived runtime copies.
for src in motion.glob('*.png'):
    convert(src,runtime_motion/(src.stem+'.webp'),512,80)

# Only the objects that Preloader currently loads need startup-optimized copies.
preload_names=[
    'enchanted-bookstack.webp',
    'moonlit-study-desk.webp',
    'celestial-telescope.webp',
    'crystal-focus-pedestal.webp',
    'moonstone-canopy-bed.webp',
    'amethyst-crystal-bed.webp',
    'study-apothecary.webp',
    'familiar-lounge.webp',
    'magic-mirror.webp',
]
for name in preload_names:
    src=objects/name
    if src.exists(): convert(src,runtime_objects/name,512,82)

# Guardian evolution action art is already final-clean WebP and loads on demand.
# Do not rebuild those 60 files during CI.

# Patch Preloader to use lighter runtime images under the SAME Phaser texture keys.
pre=san/'Preloader.js'
s=pre.read_text(encoding='utf-8')
s=s.replace("const base = './assets/motion/';","const base = './assets/runtime-motion/';")
s=re.sub(r"base \+ '([^']+)\.png'",r"base + '\1.webp'",s)
s=s.replace("'./assets/objects/enchanted-bookstack.webp?v=3314'","'./assets/runtime-objects/enchanted-bookstack.webp?v=3317-fast'")
s=s.replace("'./assets/objects/moonlit-study-desk.webp?v=3314'","'./assets/runtime-objects/moonlit-study-desk.webp?v=3317-fast'")
s=s.replace("'./assets/objects/celestial-telescope.webp?v=3314'","'./assets/runtime-objects/celestial-telescope.webp?v=3317-fast'")
s=s.replace("'./assets/objects/crystal-focus-pedestal.webp?v=3314'","'./assets/runtime-objects/crystal-focus-pedestal.webp?v=3317-fast'")
s=s.replace("'./assets/objects/moonstone-canopy-bed.webp?v=3314'","'./assets/runtime-objects/moonstone-canopy-bed.webp?v=3317-fast'")
s=s.replace("'./assets/objects/amethyst-crystal-bed.webp?v=3314'","'./assets/runtime-objects/amethyst-crystal-bed.webp?v=3317-fast'")
s=s.replace("'./assets/objects/study-apothecary.webp?v=3314'","'./assets/runtime-objects/study-apothecary.webp?v=3317-fast'")
s=s.replace("'./assets/objects/familiar-lounge.webp?v=3314'","'./assets/runtime-objects/familiar-lounge.webp?v=3317-fast'")
s=s.replace("'./assets/objects/magic-mirror.webp?v=3314'","'./assets/runtime-objects/magic-mirror.webp?v=3317-fast'")
pre.write_text(s,encoding='utf-8')

print('V3.3.17 Phaser runtime assets optimized safely')
print('motion runtime files:',len(list(runtime_motion.glob('*.webp'))))
print('object runtime files:',len(list(runtime_objects.glob('*.webp'))))
