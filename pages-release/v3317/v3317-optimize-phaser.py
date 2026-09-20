from pathlib import Path
from PIL import Image
import json,re,sys,shutil

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
    dst=runtime_motion/(src.stem+'.webp')
    convert(src,dst,512,80)
    # Image encoders can occasionally leave an empty derived file in CI.
    # Retry once and fail the build instead of shipping a broken Phaser texture.
    if not dst.exists() or dst.stat().st_size < 256:
        convert(src,dst,512,80)
    if not dst.exists() or dst.stat().st_size < 256:
        raise RuntimeError('invalid runtime motion image: '+src.name)

# Optimize exactly the objects the manifest marks for Phaser startup.
manifest_path=objects/'objects-manifest.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
preload_names=[
    o['filename'] for o in manifest.get('objects',[])
    if o.get('enabled',True) and o.get('preload') and o.get('filename')
]
for name in preload_names:
    src=objects/name
    if src.exists():
        dst=runtime_objects/name
        convert(src,dst,512,82)
        # A zero-byte runtime image makes Phaser reject the entire texture.
        # Verify the derived file while the untouched source is still available.
        if not dst.exists() or dst.stat().st_size < 256:
            convert(src,dst,512,82)
        if not dst.exists() or dst.stat().st_size < 256:
            raise RuntimeError('invalid runtime object image: '+name)

# Guardian evolution action art is already final-clean WebP and loads on demand.
# Do not rebuild those 60 files during CI.

# Patch Preloader to use lighter runtime images under the SAME Phaser texture keys.
pre=san/'Preloader.js'
s=pre.read_text(encoding='utf-8')
s=s.replace("const base = './assets/motion/';","const base = './assets/runtime-motion/';")
s=re.sub(r"base \+ '([^']+)\.png'",r"base + '\1.webp'",s)
for name in preload_names:
    s=re.sub(
        r"(['\"])\./assets/objects/"+re.escape(name)+r"\?v=[^'\"]+\1",
        lambda m: m.group(1)+'./assets/runtime-objects/'+name+'?v=3317-fast'+m.group(1),
        s
    )
pre.write_text(s,encoding='utf-8')

print('V3.3.17 Phaser runtime assets optimized safely')
print('motion runtime files:',len(list(runtime_motion.glob('*.webp'))))
print('object runtime files:',len(list(runtime_objects.glob('*.webp'))))
print('manifest preload objects:',len(preload_names))
