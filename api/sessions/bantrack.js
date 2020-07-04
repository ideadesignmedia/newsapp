const Visitor = require('../models/visitor')
const mongo = require('mongoose')
const path = require('path')
const admin = require(path.resolve('./news'))
const banned = function(user){
    return new Promise((res, rej) => {
        admin.notifysam(`BANNED USER: ${JSON.stringify(user)}`)
        return res(true)
    })
}
const pages = ['/', '/cache', '/manifest.webmanifest', '/sw.js', '/favicon.ico']
const suspiciousURLS = ['/wp-login.php', '/wp-admin', '/wp-admin.php', '/test/wp-login.php', '/backup/wp-login.php', '/.env', '/shop/index.php/admin/', '/staging/index.php/admin/']
module.exports = (req, res, next) => {
    console.log('bantrack')
    Visitor.findOne({ip: req.ip}, async (err, result) => {
        if (err) {
            console.log(err)
            return next()
        }
        if (!result) {
            console.log('no visitor')
            let visitor = new Visitor({
                _id: mongo.Types.ObjectId(),
                ip: req.ip,
                visits: 1,
                visit: [{date: new Date(), page: req.originalUrl}]
            })
            visitor.save().then(saved => {
                if (!saved) {
                    return res.status(500).json({
                        error: true,
                        page: 'NONEXISTENT'
                    })
                }
                return next()
            }).catch(e => {
                admin.notifysam(e)
                return res.status(500).json({
                    error: true,
                    page: 'NONEXISTENT'
                })
            })
        }
        if (result) {
            console.log('is visitor')
            if (result.banned) {
                return res.status(500).json({
                    error: true,
                    banned: true
                })
            }
            let banUser = function(ip){
                result.banned = true
                result.save().then(() => banned()).then(result => {
                    return res.status(500).json({
                        error: true,
                        banned: true
                    })
                }).catch(e => {
                    console.log(e)
                    admin.notifysam(e)
                    return res.status(500).json({
                        error: true
                    })
                })
            }
            let that = result.visit
            let check = await that.filter(visit => {
                if (!pages.includes(visit.page)){
                    return visit
                }
            })
            console.log('got check')
            if (check) {
                let suspects = await check.filter(suspect => {
                    if (suspiciousURLS.includes(suspect.page)) {
                        return suspect
                    }
                })
                console.log('got suspects')
                if (suspects.length >= 2) {
                    return banUser()
                }
                for(i = 0; i < suspects.length; i++){
                    if (new Date() - suspects[i].date < 100) {
                        console.log('needs banning')
                        return banUser()
                    }
                }
                result.visit.push({date: new Date(), page: req.originalUrl})
                result.save().then(saved => {
                    if (!saved) {
                        admin.notifysam('FAILING TO SAVE IN THE SUSPECT URL ROUTE IDM admin API')
                        return next()
                    }
                    return res.status(500).json({
                        error: true
                    })
                }).catch(e => {
                    console.log(e)
                    admin.notifysam(e)
                    return res.status(500).json({
                        error: true
                    })
                })
            } else {
                result.visit.push({date: new Date(), page: req.originalUrl})
                result.save().then(saved => {
                    if (!saved) {
                        admin.notifysam('FAILING TO SAVE AT BANTRACK ELSE ROUTE IDM admin API')
                        return res.status(500).json({
                            error: true
                        })
                    }
                    return next()
                }).catch(e => {
                    console.log(e)
                    admin.notifysam(e)
                    return res.status(500).json({
                        error: true
                    })
                })
            }
        }
    })
}