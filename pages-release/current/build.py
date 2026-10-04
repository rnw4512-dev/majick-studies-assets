"""Publish only canonical current-site sources; no archives or release overlays."""
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,parse_qsl,urlencode,unquote
import hashlib,json,re,shutil,subprocess,sys
source=Path(sys.argv[1]).resolve(); output=Path(sys.argv[2]).resolve()
manifest=json.loads((source/"source-manifest.json").read_text())
assert manifest["version"]=="3.4.2"
for name,digest in manifest["files"].items():
 p=source/name
 assert p.is_file() and hashlib.sha256(p.read_bytes()).hexdigest()==digest, "Unreviewed source change: "+name
assert len(list((source/"sanctuary/assets/motion").glob("*.png")))==33
if output.exists(): shutil.rmtree(output)
shutil.copytree(source,output)
release=hashlib.sha256((source/"source-manifest.json").read_bytes()).hexdigest()[:16]
# Stamp local code, stylesheet and HTML URLs, including dynamically created iframes.
pattern=re.compile(r"""(?P<q>['"])(?P<url>[^'"\s<>]*\.(?:js|css|html)(?:\?[^'"\s<>]*)?)(?P=q)""")
for p in sorted(output.rglob("*")):
 if not p.is_file() or p.suffix not in (".html",".js",".css"): continue
 if p.name=="phaser.min.js": continue
 def stamp(match):
  value=match["url"]; u=urlsplit(value)
  if u.scheme or u.netloc or value.startswith("//"): return match[0]
  resolved=(p.parent/unquote(u.path)).resolve()
  if output not in resolved.parents or not resolved.is_file(): return match[0]
  query=dict(parse_qsl(u.query,keep_blank_values=True))
  query["v"]=release
  return match["q"]+urlunsplit((u.scheme,u.netloc,u.path,urlencode(query),u.fragment))+match["q"]
 text=pattern.sub(stamp,p.read_text())
 if p.name=="index.html":
  # No storage writes: release checks cannot alter learner saves or course state.
  root="../" if p.parent.name=="sanctuary" else "./"
  guard="""<script>
window.MAJICK_RELEASE=__RELEASE__;
fetch(__ROOT__+'release.json?check='+Date.now(),{cache:'no-store'}).then(r=>{
 if(!r.ok)throw new Error('Release unavailable');return r.json();
}).then(r=>{
 if(r.build!==window.MAJICK_RELEASE){
  const u=new URL(location.href);
  if(u.searchParams.get('release')!==r.build){
   u.searchParams.set('release',r.build);location.replace(u.href);
  }
 }
}).catch(()=>{});
</script>
""".replace("__RELEASE__",json.dumps(release)).replace("__ROOT__",json.dumps(root))
  text=text.replace("<head>","<head>\n"+guard,1)
 p.write_text(text)
 # External scripts and inline classic scripts must both parse successfully.
 if p.suffix==".js": subprocess.run(["node","--check",str(p)],check=True,stdout=subprocess.DEVNULL)
 if p.suffix==".html":
  for i,m in enumerate(re.finditer(r"<script\b([^>]*)>(.*?)</script>",text,re.S|re.I)):
   attrs,code=m.groups()
   if "src=" in attrs or "application/ld+json" in attrs or not code.strip(): continue
   temp=output/".inline-check.js";temp.write_text(code)
   subprocess.run(["node","--check",str(temp)],check=True,stdout=subprocess.DEVNULL)
   temp.unlink()
(output/"release.json").write_text(json.dumps({"version":"3.4.2","build":release})+"\n")
(output/".nojekyll").touch()
# Every HTML script and stylesheet must exist and use this exact release cache key.
for p in output.rglob("*.html"):
 text=p.read_text(); seen=set()
 for url in re.findall(r"""(?:src|href)=['"]([^'"]+)['"]""",text):
  u=urlsplit(url)
  if u.scheme or u.netloc or not u.path.endswith((".js",".css")): continue
  assert (p.parent/unquote(u.path)).is_file(), (p,url)
  assert dict(parse_qsl(u.query)).get("v")==release, (p,url)
  assert u.path not in seen, ("Duplicate runtime",p,url)
  seen.add(u.path)
print("Current-only V3.4.2 build verified:",release)
