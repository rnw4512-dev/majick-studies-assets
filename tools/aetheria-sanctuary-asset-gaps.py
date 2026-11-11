"""List verified incomplete four-frame cycles; never generates/replaces protected art."""
from pathlib import Path
import json
from PIL import Image
base=Path('current-site');stages=['new-bond','apprentice','guardian','ascendant','celestial'];rows=[]
for canon in ['velora','cascade','solstice','aurelia','vesper','briar','zephyr','prism','rook','solara']:
 for stage in stages:
  if canon=='velora':
   reference=f'pixi-sanctuary/frames/{canon}/{stage}/walk-1.png';count=sum((base/f'pixi-sanctuary/frames/{canon}/{stage}/walk-{i}.png').exists() for i in range(1,5));status=f'{count} approved walking frames; retain originals, supply missing unique gait frames'
  elif canon in ['cascade','solstice','aurelia'] and stage=='new-bond':
   reference=f'assets/atelier/v2/fitted/companions/{canon}_walk_1.webp';count=2;status='2 approved new-bond walking frames at existing source; complete cycle unavailable'
  else:
   reference=f'sanctuary/assets/evolutions/{canon}/{stage}/walk.webp' if canon in ['cascade','solstice','aurelia'] else f'assets/familiars/canon/{canon}-guardian.webp';count=0;status='still stage artwork fallback; no approved four-frame cycle' if canon in ['cascade','solstice','aurelia'] else 'transparent canonical portrait fallback; evolution illustration remains in profile; no approved stage walking cycle'
  image=Image.open(base/reference)
  if count<4:rows.append(dict(id=f'{canon}-{stage}-four-frame-walk',characterOrObject=canon,requiredEvolution=stage,role='complete four-frame walking cycle',sourceReference=reference,expectedPath=f'pixi-sanctuary/frames/{canon}/{stage}/walk-{{frame}}.png',width=image.width,height=image.height,transparent=True,frameCount=4,currentStatus=status,priority='P2 visual',existingApprovedWalkFrames=count))
Path('docs/audits/aetheria-missing-visual-assets.json').write_text(json.dumps(rows,indent=2)+'\n');print(f'{len(rows)} incomplete cycles; no artwork modified')
