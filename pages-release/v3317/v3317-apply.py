from pathlib import Path
import json,re,sys

root=Path(sys.argv[1])

idx=root/'index.html'
s=idx.read_text(encoding='utf-8')
tag='<script src="./v3317-main.js?v=3317"></script>'
if tag not in s:
    s=s.replace('</body>',tag+'\n</body>',1)

# Remove the old service-worker registration while the app is under active development.
s='\n'.join(line for line in s.splitlines() if 'navigator.serviceWorker.register("./service-worker.js")' not in line)
# Remove the legacy V5.2 global crash modal; V3.3.17 installs a safer handler instead.
s='\n'.join(line for line in s.splitlines() if "Moonlit V5.2 runtime error" not in line)
idx.write_text(s,encoding='utf-8')

# Retire any older Majick service worker a browser may still request directly.
sw=root/'service-worker.js'
sw.write_text("""const CACHE='majick-studies-retired-v3317';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('majick-studies-')).map(k=>caches.delete(k)));
  await self.registration.unregister();
  const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of clientsList){try{client.postMessage({type:'MAJICK_SW_RETIRED_V3317'});}catch(_){}}
})()));
self.addEventListener('fetch',()=>{});
""",encoding='utf-8')

ap=root/'app-progress.json'
d=json.loads(ap.read_text(encoding='utf-8'))
d.update({
  'version':'V3.3.17',
  'release_name':'Guardian Repair + Course Realms + Stability Hotfix',
  'overall_full_vision_percent':84,
  'usable_study_app_percent':92,
  'what_changed':list(dict.fromkeys([
    'Main app shell now reports V3.3.17 consistently after every render.',
    'Service worker registration is disabled during active development so stale shells cannot take over newer releases.',
    'Previously installed Majick service workers are retired and old Majick caches are cleared.',
    'The legacy snag modal is replaced by a V3.3.17 runtime handler that ignores resource-only failures.',
    'Corrected 60 individual Guardian evolution action assets are deployed.',
    'Phase 4 movement logic remains the protected movement controller.',
  ] + d.get('what_changed',[])))
})
ap.write_text(json.dumps(d,indent=2),encoding='utf-8')
print('V3.3.17 main shell applied safely')
