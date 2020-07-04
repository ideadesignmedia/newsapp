const mongo = require('mongoose');
const Visitor = require('../models/visitor');
const { notifysam } = require('../../news');
const pages = ['/', '/signup']
module.exports = (req, res, next) => {
    //TAKE IN IP AND PAGE REQUEST
    const cat = req.ip;
    const inca = req.originalUrl;
    let dateDisplay = new Date();
    //FIND VISITOR BY IP FUNCTION
    Visitor.findOne({ip: cat}).then(result => {
        //IF NOT IN DATABASE
        if (result == null) {
            let visy = new Visitor({
                _id: new mongo.Types.ObjectId(),
                ip: cat,
                visits: 1,
                visit: [{
                    date: dateDisplay,
                    page: [inca]
                }]
            })
            //create new visitor and save and provide a cookie with idm and timestamp
            visy.save().then(()=>{
                console.log('added visitor')
                return next();
            }).catch((e) => {
                res.status(500).json({
                    message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5991'
                });
            });      
        }
        //IF THEY ARE IN THE DATABASE
        if (result) {
            if (result.banned) {
                return res.status(500).json({
                    error: true,
                    banned: true
                })
            }
            //UPDATE WITH A NEW VISIT AND INCREASE VISIT COUNT
            Visitor.collection.updateOne( {_id: result._id}, {$inc: {visits: 1},
                $push: { visit: {date: dateDisplay, page: [inca]}}}
            ).then( result => {
                console.log('updated visitor ' + dateDisplay)
                return next();
            }).catch((e) => {
                console.log(e)
            res.status(500).json(
                {message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5990'}
                );
            });
        }
    }).catch((e)=>{
        res.status(500).json({
            message: 'PAGE FAILED PLEASE TRY AGAIN | IDM Error Code:5989'
        });
    });
}

