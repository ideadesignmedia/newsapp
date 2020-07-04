const cacheName = 'v1.1'
getCache = function(){
    return new Promise((res) => {
        fetch('/cache', {
            method: 'post',
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: 'body=true'
        }).then(result => result.json()).then(result => {
            console.log(JSON.stringify(result))
            if (result.error === false) {
                return res(result.cache)
            } else {
                return res(['/'])
            }
        }).catch(err => {
            console.log(err)
            return res(['/'])
        })
    })
}
self.addEventListener('install', (e)=>{
    console.log('IDMSW INSTALLED')
    e.waitUntil(caches.open(cacheName).then(cache => {
        getCache().then(cacheItems => {
            for (i = 0; i < cacheItems.length; i++) {
                let that = cacheItems[i]
                caches.match(cacheItems[i]).then(result => {
                    if (!result) {
                        cache.add(that)
                    }
                })
            }
            caches.match('/').then(result => {
                if (!result) cache.add('/')
            })
            }).catch(err => {
                console.log(err)
            })
        }).catch(er => { console.log(er)})
    )
})
self.addEventListener('activate', (e)=>{
    console.log('IDMSW ACTIVATED')
    e.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cache => {
                if (cache !== cacheName) {
                    console.log('IDMSW Clearing old cache')
                    caches.delete(cache)
                }
            })
        )
    }).catch(er => {console.log(er)}))
})
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => {
        if (!res) {
            return fetch(e.request)
        } else {
            return res
        }
    }))
})