from pathlib import Path
from PIL import Image
import sys

root=Path(sys.argv[1])
guardians=('velora','cascade','solstice','aurelia')
stages=('new-bond','apprentice','guardian','ascendant','celestial')
done=0
for guardian in guardians:
    for stage in stages:
        p=root/f'{guardian}-{stage}.webp'
        if not p.exists():
            raise SystemExit(f'Missing approved stage portrait: {p}')
        im=Image.open(p).convert('RGB')
        if im.size!=(640,1000):
            im=im.resize((640,1000),Image.Resampling.LANCZOS)
            im.save(p,'WEBP',quality=96,method=6)
        done+=1
print(f'Prepared {done} approved Guardian portraits at 640x1000')
