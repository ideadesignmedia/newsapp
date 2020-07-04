
const mongo = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./api/models/user')
const nm = require('nodemailer')
const multer = require('multer')
const path = require('path')
const Visitor = require('./api/models/visitor')
ipConsolidate = function(ip, user) {
    return new Promise(async (res, rej) => {
        let consolidateduser
        await User.findOneAndUpdate({_id: user}, { $addToSet: {ips: {ip: ip}} }, {returnOriginal: false}, (err, user) => {
            if (err) {
                return rej(err)
            }
            if (!user) {
                return res(false)
            }
            if (user) {
                console.log(user)
                consolidateduser = user.ips
                user.save().then(result => {
                    return res(true)
                }).catch((e) => {
                    return rej(e)
                });
            }
        })
    })
}
addOverhaul = function(req){
    Visitor.findOne({ip: req.ip}, (err, visitor) => {
        if (err) {
            console.log(err)
        }
        if (visitor) {
            visitor.overhaul++
            visitor.save().then(result => {
                console.log('increased a users overhaul')
            }).catch(e => {
                console.log(e)
            })
        }
    })
}
checkAuth = function(req){
    return new Promise((res, rej) => {
        const token = req.headers['authentication'];
        const authcook = req.cookies['authorization'];
        console.log(`VERIFYING token ${token} or cookie ${authcook}`);
        if (token == null || token === 'Bearer undefined') {
            console.log('cookie security path');
            if (authcook == null) {
                console.log(`null cookie ${authcook}`);
                return res(false)
            } else {
                jwt.verify(authcook, process.env.JWTSECRET, (err, auth) => {
                    if (err) {
                        if (err.message == 'invalid signature') {
                            var payload = jwt.verify(authcook, process.env.JWTSECRETADMIN, (err, auth) => {
                                if (err) {
                                    return rej(err)
                                }
                                if (!auth) {
                                    console.log(`AUTH WAS ${auth}`)
                                    return res(false)
                                }
                                if (auth) {
                                    console.log(`Verified cookie ${authcook}`);
                                    return res(true)
                                }
                            })
                        }
                        else {
                            return rej(err)
                        }
                    } else if (!auth) {
                        return res(false)
                    } else if (auth) {
                        console.log(`Verified cookie ${authcook}`);
                        return res(true)
                    }
                });
            }
        } else {
        console.log('Header security path');
        var mew = token.split('"');
        var pulledtoken = mew[1];
        jwt.verify(pulledtoken, process.env.JWTSECRET, (err, auth) => {
                if (err) {
                    console.log(err);
                    return rej(err)
                } else if (!auth) {
                    return res(false)
                } else if (auth) {
                    console.log(`Verifiedtoken ${token}`);
                    return res(true)
                }
            });
        }
    })
}
sendEmail = function(email, subject, markup){
    return new Promise((res, rej) => {
        let transporter = nm.createTransport({
            name: 'ideadesignmedia.com',
            host: "mail.ideadesignmedia.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'mail@ideadesignmedia.com',
                pass: 'jP0lZq}DSSE;'
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let response = {
            from: '"IDM" <mail@ideadesignmedia.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            // plain text body
            text: `META TAG (title): Email
            
            
            
            ${markup}
            <a style="text-decoration: none;"><div style="width: 100%; text-align: center; font-size: 10px;">IDEA DESIGN MEDIA LLC.</div></a>
            `,
            // html body
            html: `<!doctype html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>Email</title>
            </head>
            <body style="max-width: 100%; padding: 10px; overflow-X: hidden;">
            <div style="text-align: center; background-color: #E2E2E3; color: #000504; font-family: roboto arial sans-serif; max-width: 100%; overflow-x: hidden; min-width: 80%; min-height: 100vh; margin:0px; padding: 30px;">
                ${markup}
            </div>
            </body>
            </html>`
        }
        transporter.sendMail(response, (err, info) => {
            if (err) {
            console.log(err);
            return res(false)
            }
            if (info) {
            console.log(`message sent to: ${email} info: ${JSON.stringify(info)}`);
            return res(true)
            }
        })
    })
}
const storage = multer.diskStorage({
    destination: './public/useruploads',
    filename: function(req, file, cb) {
        var date = new Date().toISOString();
        var ds = date.split(':');
        cb(null, ds[1] + file.originalname + ds[0] + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage,
    filename: function(req, file, cb) {
        cb(null, file.originalname + new Date().toISOString() + path.extname(file.originalname));
    }, limits: {
        fileSize: 1000000
    }, fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/jpg' || file.mimetype === 'image/svg+xml' || file.mimetype === 'video/quicktime' || file.mimetype === 'video/mp4') {
            cb(null, true);
            console.log('tried to save')
        } else {
            cb(null, false);
            console.log('image rejected: ' + file.mimetype);
        }
}})
validateUser = function(user){
    return new Promise((res, rej) => {
        if (mongo.Types.ObjectId.isValid(user)) {
            User.findOne({_id: user}, (err, user) => {
                if (err) {
                    return rej(err)
                }
                if (!user) {
                    return res(false)
                }
                if (user) {
                    return res(true)
                }
            })
        } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user)) {
            User.findOne({email: user}, (err, user) => {
                if (err) {
                    return rej(err)
                }
                if (!user) {
                    return res(false)
                }
                if (user) {
                    return res(true)
                }
            })
        } else {
            User.findOne({username: user}, (err, user) => {
                if (err) {
                    return rej(err)
                }
                if (!user) {
                    return res(false)
                }
                if (user) {
                    return res(true)
                }
            })
        }
    })
}
getUser = function(user){
    return new Promise((res, rej) => {
        if (mongo.Types.ObjectId.isValid(user)) {
            User.findOne({_id: user}, (err, user) => {
                if (err) {
                    return rej(err)
                }
                if (!user) {
                    return res(false)
                }
                if (user) {
                    return res(true)
                }
            })
        } else {
            User.findOne({email: user}, (err, user) => {
                if (err) {
                    return rej(err)
                }
                if (!user) {
                    return res(false)
                }
                if (user) {
                    return res(user)
                }
            })
        }
    })
}
module.exports = {
    getUser: getUser,
    validateUser: validateUser,
    upload: upload,
    checkAuth: checkAuth,
    sendEmail: sendEmail,
    ipConsolidate: ipConsolidate,
    addOverhaul: addOverhaul
}