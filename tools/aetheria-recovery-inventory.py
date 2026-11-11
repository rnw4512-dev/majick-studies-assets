"""Read-only source/storage/media inventory. Never generates or replaces artwork."""
import json,re,sys
from pathlib import Path
base=Path(sys.argv[1]).resolve();out=Path(sys.argv[2]);out.mkdir(parents=True,exist_ok=True)
refs=[];storage=[];missing={};allfiles=[p for p in base.rglob('*') if p.is_file()]
for p in sorted(base.rglob('*')):
 if not p.is_file() or p.suffix not in ['.js','.css','.html','.json']:continue
 if '.min.' in p.name:continue
 text=p.read_text(errors='replace');rel=p.relative_to(base).as_posix()
 for m in re.finditer(r'''(?:["'])([^"'\n\r<>]+\.(?:png|jpe?g|webp|gif|svg|ogg|mp3|woff2|js|css))(?:[?][^"']*)?["']''',text):
  value=m[1]
  if any(x in value for x in ['${','+','{','}', '=>','data:', ' ']) or value.startswith(('http:','https:','//','blob:')):continue
  if not '/' in value and not value.endswith(('.js','.css')) and p.suffix=='.js':continue
  if value.startswith('skill:'):continue
  dest=(p.parent/value).resolve();alternatives=[dest,(base/value).resolve()];suffix=[x for x in allfiles if x.as_posix().endswith('/'+value.lstrip('./'))];dest=next((x for x in alternatives if x.is_file()),suffix[0] if len(suffix)==1 else dest);line=text.count('\n',0,m.start())+1
  reference={'sourceReference':rel+':'+str(line),'path':value,'resolvedPath':str(dest.relative_to(base)) if dest.is_relative_to(base) else None,'present':dest.is_file()}
  refs.append(reference)
  if not dest.is_file() and dest.is_relative_to(base) and p.suffix!='.json' and (value.startswith(('assets/','./assets/','../assets/')) or p.suffix in ['.css','.html']):
   name=dest.relative_to(base).as_posix();missing.setdefault(name,{'id':'missing-'+re.sub(r'[^a-z0-9]+','-',name.lower()),'characterOrObject':dest.stem,'requiredEvolution':None,'role':'literal runtime source reference','sourceReference':reference['sourceReference'],'expectedPath':name,'width':None,'height':None,'transparent':None,'frameCount':None,'currentStatus':'missing-on-disk; activation requires runtime verification','priority':'verify','references':[]})['references'].append(reference['sourceReference'])
 for m in re.finditer(r'''(?:localStorage|sessionStorage)\.(getItem|setItem|removeItem)\(([^)\n]{1,180})''',text):storage.append({'source':rel,'line':text.count('\n',0,m.start())+1,'operation':m[1],'keyExpression':m[2]})
(out/'aetheria-recovery-source-storage-inventory.json').write_text(json.dumps({'baselineCommit':'31be7d10f31ebb71b66a2055ef0246d228aac9ce','files':sum(p.is_file() for p in base.rglob('*')),'references':refs,'storage':storage},indent=2)+'\n')
(out/'aetheria-missing-visual-assets.json').write_text(json.dumps([x for x in missing.values() if not x['expectedPath'].endswith(('.js','.css'))],indent=2)+'\n')
print(json.dumps({'literalReferences':len(refs),'storageOperations':len(storage),'unresolvedLiteralPaths':len(missing)}))
