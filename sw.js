const C='glowup-v1';
const A=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const k=n.clone();caches.open(C).then(c=>c.put(e.request,k));return n})));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(n=>{if(n.ok){const k=n.clone();caches.open(C).then(c=>c.put(e.request,k))}return n})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
