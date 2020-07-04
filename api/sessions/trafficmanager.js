const Visitor = require('../models/visitor')
module.exports = (req, res, next) => {
    Visitor.findOne({ip: req.ip}, (err, visi) => {
        if (err) {
            return res.status(500).json({
                error: true
            })
        }
        if (!visi) {
            return next()
        }
        if (visi) {
            let that = new Date()
            let it =  visi.visit[visi.visit.length - 1].date
            let time = that - it
            if (time < 500) {
                if (!visi.overhaul) {
                    visi.overhaul = 0
                }
                visi.overhaul++
                visi.save().then(result => {
                    if (time < 50 || visi.overhaul <= 5) {
                        visi.banned = true
                        visi.save().then(()=>{
                            return res.status(500).json({
                                error: true,
                                banned: true
                            })
                        }).catch(e => {
                            console.log(e)
                            return res.status(500).json({
                                error: true
                            })
                        }) 
                    } else {
                        return res.status(500).json({
                            error: true
                        })
                    }
                }).catch(e => {
                    console.log(e)
                    return res.status(500).josn({
                        error: true
                    })
                })
            } else {
                return next()
            }
        }
    })
}