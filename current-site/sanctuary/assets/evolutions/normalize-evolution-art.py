from pathlib import Path
from PIL import Image
import sys

root=Path(sys.argv[1])
count=0
for p in root.glob('*/*/*.webp'):
    try:
        im=Image.open(p).convert('RGBA')
        alpha=im.getchannel('A')
        box=alpha.getbbox()
        if not box:
            continue
        l,t,r,b=box
        w=max(1,r-l);h=max(1,b-t)
        pad=max(16,int(max(w,h)*0.07))
        l=max(0,l-pad);t=max(0,t-pad);r=min(im.width,r+pad);b=min(im.height,b+pad)
        cropped=im.crop((l,t,r,b))
        cropped.save(p,'WEBP',lossless=True,method=6)
        count+=1
    except Exception as e:
        raise SystemExit(f'Could not normalize {p}: {e}')
print(f'Normalized {count} Guardian evolution WebPs')
if count and count < 60:
    raise SystemExit(f'Expected 60 Guardian evolution WebPs, normalized only {count}')
