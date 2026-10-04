"""Freeze the verified V3.4.2 output once. Never used by normal publishing."""
from pathlib import Path
import hashlib,json,re,shutil,sys
source=Path(sys.argv[1]); target=Path(sys.argv[2])
if target.exists(): raise SystemExit("Current source already exists; refusing to overwrite it")
shutil.copytree(source,target)
renames={
"v3310-ui-compat.js":"ui-compat.js","v3312-ui-compat.js":"study-ui-compat.js",
"v3317-main.js":"app-runtime.js","v3322-main-recovery.js":"app-recovery.js",
"v3317-sanctuary.js":"sanctuary-runtime.js","v3320-sanctuary-life.js":"sanctuary-life.js",
"v3321-sanctuary-customize.js":"sanctuary-customize.js",
"v3322-sanctuary-recovery.js":"sanctuary-recovery.js",
"v3325-sanctuary-visual-authority.js":"sanctuary-visual-authority.js"}
for p in list(target.rglob("*")):
 if p.is_file() and p.suffix in (".html",".js",".css",".json",".webmanifest"):
  s=p.read_text()
  for old,new in renames.items(): s=s.replace(old,new)
  if p.name=="index.html" and p.parent==target:
   s=s.replace("\\n<link","\n<link").replace("\\n<script","\n<script")
   s=re.sub(r"pill\.textContent=(?:'[^']*'|MAJICK_VERSION|MAJICK_CAMPUS_VERSION|MAS_VERSION|LF_VERSION)", "pill.textContent='Majick Studies • V3.4.2'",s)
   s=re.sub(r"document\.title='Majick Studies[^']*'", "document.title='Majick Studies — V3.4.2'",s)
   s=re.sub(r"<title>.*?</title>","<title>Majick Studies — V3.4.2</title>",s,count=1)
  if p.name=="index.html":
   s=s.replace("\\n<script","\n<script")
  if p.name=="v3317-main.js":
   s=s.replace("3.3.52-game-realm","3.4.2")
   s=s.replace("?v=3350-guardian-room&context=","?v=3.4.2&context=")
   s=s.replace("regs.map(r=>r.unregister())","regs.filter(r=>r.scope.startsWith(new URL('./',location.href).href)).map(r=>r.unregister())")
  p.write_text(s)
for old,new in renames.items():
 for p in list(target.rglob(old)): p.rename(p.with_name(new))
# Obsolete standalone recovery pages are replaced with a state-preserving redirect.
for p in target.rglob("*.html"):
 if p.name!="index.html":
  p.write_text('<!doctype html><meta charset="utf-8"><title>Majick Studies</title><script>location.replace("./?release=3.4.2")</script>')
data=json.loads((target/"app-progress.json").read_text())
for k in ("golden_baseline_source_commit","golden_baseline_source_run_id","current_overlay_commit","historical_patch_chain"): data.pop(k,None)
data.update(version="V3.4.2 D772 Section 2 Lesson 2 Graphical Displays",build_foundation="current-site: canonical V3.4.2 source",sanctuary_version="V3.4.2")
(target/"app-progress.json").write_text(json.dumps(data,indent=2)+"\n")
# Retirement worker remains at its original URL for browsers with an old controller.
(target/"service-worker.js").write_text("""self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('majick-studies-')).map(k=>caches.delete(k)));
 await self.registration.unregister();
 const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of clients){
  const url=new URL(client.url);
  if(url.href.startsWith(self.registration.scope)){
   url.searchParams.set('release','3.4.2');
   await client.navigate(url.href);
  }
 }
})()));
""")
# Hash-lock all source files, including the 33 protected movement images.
files={p.relative_to(target).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()
 for p in sorted(target.rglob("*")) if p.is_file()}
(target/"source-manifest.json").write_text(json.dumps({"version":"3.4.2","files":files},indent=2)+"\n")
print("Frozen current V3.4.2 source:",len(files),"files")
