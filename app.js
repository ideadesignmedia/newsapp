// REQUIREMENTS FOR APP TO RUN
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const loggingtool = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongo = require('mongoose')
const bcrypt = require('bcrypt')
const fs = require('fs');
const User = require('./api/models/user')
const news = require('./news')
const idm = require('./idm')
//START NEWSTIMER
let startTime = new Date()
let newsTime = new Date(startTime)
newsTime.setDate(newsTime.getDate() + 1)
newsTime.setHours(7)
newsTime.setMinutes(0)
let timeDifference = newsTime - startTime
setTimeout(()=> {
    news.provide()
    news.sendStats()
    setInterval(()=>{
        provide = setInterval(()=>{
            news.provide()
            news.sendStats()
        }, 1000*60*60*24)
    });
}, timeDifference)
//
const track = require('./api/sessions/track')
const bantrack = require('./api/sessions/bantrack')
const traffic = require('./api/sessions/trafficmanager');
const Visitor = require('./api/models/visitor');
app.set('trust proxy', true);
dotenv.config();
app.use(loggingtool('dev'));
mongo.connect("mongodb://localhost/db1", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true}).then(() => { console.log('Successful MongoDB Connection') });
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({
            options: 'get, post, patch, put, delete'
        });
    }
    next();
});
app.use('/favicon.ico', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'image/x-icon'})
    fs.readFile('./public/favicon.ico', (err, data) => {
        if (err) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
// app.delete('/collections', (req, res) => {
//     News.find({}, (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 error: true,
//                 message: err
//             })
//         } else {
//             return res.status(200).json({
//                 deleted: true,
//                 result: result
//             })
//         }
//     })
// })
// app.get('/collections', (req, res) => {
//     News.find({}, (err, result) => {
//         if (err) {
//             return res.status(500).json({
//                 error: true
//             })
//         }
//         return res.status(200).json({
//             collections: result
//         })
//     })
// })
app.post('/news', (req, res) => {
    if (req.body.email) {
        User.findOne({email: req.body.email}, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    error: true
                })
            }
            if (!user) {
                return res.status(500).json({
                    error: true
                })
            }
            if (user) {
                news.getNews(user, req.body.topics).then(result => {
                    if (result) {
                        return res.status(200).json({
                            emailed: true
                        })
                    }
                }).catch(e => {
                    console.log(e)
                }) 
            }
        })
    }
})
app.use('/sw.js', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/javascript' })
    fs.readFile('./IDM_SW.js', (error, data) => {
        if (error) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
app.use('/manifest.webmanifest', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/web+manifest'})
    fs.readFile('./manifest.webmanifest', (err, data) => {
        if (err) {
            res.write('404 error: page failed')
        } else {
            res.write(data)
        }
        res.end()
    })
})
app.use('/cache', track, async (req, res) => {
    let arr = []
    let readFiles = function(){
        return new Promise((res) => {
            fs.readdir('./public/cache', (err, data) => {
                if (err) {
                    console.log('Unable to scan directory: ' + err);
                    return rej()
                }
                if (!data) {
                    return res(true)
                }
                for (i = 0; i < data.length; i++) {
                    arr.push(`/static/cache/${data[i]}`)
                    if (i === data.length - 1) {
                        return res(true)
                    }
                }
            })
        })
    }
    readFiles().then(result => {
        return res.status(200).json({
            error: false,
            cache: arr
        })
    }).catch(e => {
        return res.status(200).json({
            error: true,
            message: e
        })
    })
})
app.use('/static', express.static('./public'))
//ROUTING
app.use('/signup', track, (req, res, next) => {
    let it = req.body.email
    if (!it) {
        return res.status(200).json({
            error: true,
            message: 'Received an empty request'
        })
    }
    it = it.toLowerCase()
    User.findOne({email: it}, (er, exists) => {
        if (er) {
            return res.status(500).json({
                error: true,
                message: 'Issue Processing Your Request'
            })
        }
        if (exists) {
            if (req.body.topics) {
                exists.topics = req.body.topics
                exists.save().then(saved => {
                    return news.getNews(saved, saved.topics).then(result => {
                        if (result) {
                            return res.status(200).json({
                                emailed: true,
                                error: false
                            })
                        } else {
                            return res.status(500).json({
                                error: true,
                                message: 'Failed to send news to you.'
                            })
                        }
                    }).catch(e => {
                        console.log(e)
                    })     
                })
            } else {
                return news.getNews(exists, req.body.topics).then(result => {
                    if (result) {
                        return res.status(200).json({
                            emailed: true,
                            error: false
                        })
                    } else {
                        return res.status(500).json({
                            error: true,
                            message: 'Failed to send news to you.'
                        })
                    }
                }).catch(e => {
                    console.log(e)
                })     
            }
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        error: true,
                        message: 'issue with hashing users password'
                    })
                }
                if (!hash) {
                    return res.status(500).json({
                        error: true,
                        message: 'Failed to hash password'
                    })  
                } else {
                    let username = req.body.username
                    if (username) {
                        username = username.toLowerCase()
                    } else {
                        username = 'NEWSUSER' + Math.round(Math.random*100000)
                    }
                    let that = new User({
                        _id: new mongo.Types.ObjectId(),
                        username: req.body.username,
                        email: it,
                        password: hash,
                        topics: req.body.topics,
                        superuser: false,
                        ips: [req.body.ip]
                    })
                    that.save().then(result => {
                        res.status(200).json({
                            message: 'succesfully created user',
                            error: false
                        })
                        return getNews(result, result.topics).catch(e => {
                            console.log(e)
                            news.notifysam(e)
                            User.findOneAndDelete({_id: result._id}, (err, deleted) => {
                                if (err || !deleted) {
                                    return news.notifysam('FUCK COULDNT DELETE A USER WHO FAILED EMAIL: ' + `${result} ` + err)
                                }
                            })
                        })
                    }).catch(e => {
                        console.log(e)
                        idm.addOverhaul(req)
                        return res.status(500).json({
                            error: true,
                            message: 'Please Try Again with a Different Display Name'
                        })
                    })
                }
            })
        }
    })
})
//
app.get('/', track, (req, res) => {
    if (req.originalUrl === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        fs.readFile('./index.html', (error, data) => {
            if (error) {
                res.write('404 error: page failed')
            } else {
                res.write(data)
            }
            res.end()
        })
    } else {
        return res.status(404).json({
            message: 'page not found'
        })
    }
})
app.use((req, res, next) => {
    const error = new Error('page not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
module.exports = app