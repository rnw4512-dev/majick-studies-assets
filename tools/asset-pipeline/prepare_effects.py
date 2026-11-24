from pathlib import Path
from PIL import Image
import zipfile,io,re,hashlib,json,shutil
import argparse
parser=argparse.ArgumentParser();parser.add_argument('intake',type=Path);parser.add_argument('--app',type=Path,default=Path('current-site'));args=parser.parse_args()
root=args.app/'assets/licensed'
for name in ['effects','milestones','textures']:(root/name).mkdir(parents=True,exist_ok=True)
def uploaded(name):return next(args.intake.rglob(name))
def natural(name):return [int(x) if x.isdigit() else x for x in re.split(r'(\d+)',name)]
records=[]
for label,archive,prefix in [('light','LightEffects.zip','LightEffect_'),('nature','Nature Magic Effect.zip','1-'),('arcane','Arcane_Effect.zip','03/Arcane_'),('projectile','Pure Projectile Effect.zip','Files/Pure_')]:
 p=uploaded(archive)
 with zipfile.ZipFile(p) as z:
  names=sorted([n for n in z.namelist() if n.startswith(prefix) and n.endswith('.png')],key=natural)
  imgs=[Image.open(io.BytesIO(z.read(n))).convert('RGBA') for n in names]
  w=max(im.width for im in imgs);h=max(im.height for im in imgs);frames=[]
  for im in imgs:
   c=Image.new('RGBA',(w,h));c.alpha_composite(im,((w-im.width)//2,(h-im.height)//2));c.thumbnail((176,176));frames.append(c)
  frames[len(frames)//2].save(root/'effects'/f'{label}-poster.webp',lossless=True)
  frames.append(Image.new('RGBA',frames[0].size))
  frames[0].save(root/'effects'/f'{label}.webp',save_all=True,append_images=frames[1:],duration=35 if len(frames)>20 else 70,loop=1,lossless=True)
  records.append({'name':label,'author':'Cethiel','license':'CC0-1.0','archive':archive,'archiveSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'frames':names,'alignment':'Original pixels centered in common frame; scaled down to at most 176px. One play plus transparent final frame.'})
with zipfile.ZipFile(uploaded('life_milestone_icons_cc0.zip')) as z:
 for name in ['heart','house','book','briefcase','globe','star','bottle','hourglass']:(root/'milestones'/f'{name}.png').write_bytes(z.read(name+'_32.png'))
 (root/'milestones'/'LICENSE.txt').write_bytes(z.read('LICENSE.txt'))
with zipfile.ZipFile(uploaded('pdtextures.zip')) as z:
 for label,name in [('parchment','461223114.jpg'),('sage','461223158.jpg'),('slate','461223198.jpg')]:
  im=Image.open(io.BytesIO(z.read(name)));im.resize((128,128)).save(root/'textures'/f'{label}.webp',quality=80)
(root/'effects'/'frame-provenance.json').write_text(json.dumps(records,indent=2)+'\n')
