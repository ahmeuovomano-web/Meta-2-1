const CACHE='meta-cache-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method==='GET')event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match('./index.html'))))});
self.addEventListener('push',event=>{
  let data={title:'META',body:'Uma pequena ação pode fazer diferença hoje.',url:'./'};
  try{if(event.data)data={...data,...event.data.json()}}catch(_){if(event.data)data.body=event.data.text()}
  event.waitUntil(self.registration.showNotification(data.title||'META',{body:data.body||'Uma pequena ação hoje.',icon:'./icons/icon-192.png',badge:'./icons/icon-192.png',tag:data.tag||'meta-reminder',renotify:false,data:{url:data.url||'./'}}));
});
self.addEventListener('notificationclick',event=>{event.notification.close();const target=new URL(event.notification.data?.url||'./',self.location.origin).href;event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const client of list){if(client.url.startsWith(self.location.origin)&&'focus'in client)return client.focus()}return clients.openWindow?clients.openWindow(target):undefined}))});
