if('serviceWorker' in navigator) {
    console.log('service worker is enabled')
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(result => {
            console.log('IDMSW Registered');
            let date = sessionStorage.getItem('idmdate')
            if (!date) {
                sessionStorage.setItem('idmdate', new Date().toString())
            } else {
                let today = new Date()
                let time = Math.abs(today - new Date(date))
                if (time >= (1000*60*60*8)) {
                    sessionStorage.clear()
                    sessionStorage.setItem('idmdate', new Date().toString())
                }
            }
        }).catch((e) => {
            console.log(`IDMSW error: ${e}`)
        })
    })
}