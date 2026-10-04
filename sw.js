const CACHE='fastoolee-suite-20260924-pdf22-unified';
const CORE=['/','/manifest.webmanifest','/assets/icons/icon-192.png','/assets/icons/icon-512.png','/assets/icons/favicon.png','/assets/brand/fastoolee-logo.webp'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('/'))));return;
  }
  if(['style','script','image','font'].includes(req.destination)){
    event.respondWith(caches.match(req).then(hit=>{const fresh=fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(()=>hit);return hit||fresh;}));
  }
});
