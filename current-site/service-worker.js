self.addEventListener('install',()=>self.skipWaiting());
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
