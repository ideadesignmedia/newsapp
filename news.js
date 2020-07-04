const chrome = require('puppeteer')
const mongo = require('mongoose')
const nm = require('nodemailer')
const News = require('./api/models/news')
const User = require('./api/models/user')
const Visitor = require('./api/models/visitor')
sendEmail = function(email, subject, markup){
    return new Promise((res, rej) => {
        let transporter = nm.createTransport({
            name: 'ideadesignmedia.com',
            host: "mail.ideadesignmedia.com",
            port: 465,
            secure: true,
            auth: {
                user: 'mail@ideadesignmedia.com',
                pass: process.env.MAILPASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        let response = {
            from: '"IDM NEWSBOT" <mail@ideadesignmedia.com>',
            to: email,
            subject: subject,
            text: `META TAG (title): Email
            
            

            ${markup}
            <a style="text-decoration: none;"><div style="width: 100%; text-align: center; font-size: 10px;">IDEA DESIGN MEDIA LLC.</div></a>
            `,
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
addCollection = function(user, collection){
    return new Promise((res, rej) => {
        User.findOne({_id: user._id}, (err, user) => {
            if (err) {
                return rej(null)
            }
            if (!user) {
                return res(false)
            }
            if (user) {
                if (!user.collections) {
                    user.collections = [collection._id]
                } else {
                    user.collections.push(collection._id)
                }
                user.save().then(result => {
                    if (result) {
                        console.log('added collection to user ' + result)
                        return res(true)
                    } else {
                        return res(false)
                    }
                }).catch(e => {
                    console.log(e)
                    return rej(false)
                })
                
            }
        })
    })
}
getNews = function(user, topics){
    return new Promise((gotthenews, failedtogetthenews) => {
        chrome.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']}).then(async browser =>{
            const page1 = await browser.newPage();
            let news = []
            for (i = 0; i < topics.length; i++) {
                let time = 1250
                let tryx = function(x, time) {
                    return new Promise(async(res) => {
                        let timer = setTimeout(()=>{
                            return res(false)
                        }, time)
                        await page1.waitForXPath(x)
                        clearTimeout(timer)
                        res(true)
                    })
                }
                //maybe move out of loop.
                const context = browser.defaultBrowserContext()
                context.overridePermissions('https://www.google.com/', ['geolocation'])
                await page1.goto('https://www.google.com/search?q=' + topics[i] + ' news', {waitUntil: 'domcontentloaded'})
                let a1
                await tryx('//*[@id="hdtb-msb-vis"]/div[2]/a', time).then(result => {
                    if (!result) {
                        a1 = false
                    } else {
                        a1 = true
                    }
                }).catch(e => {
                    console.log(e)
                    a1 = false
                })
                if (!a1) {
                    continue
                }
                let that = await page1.evaluate(()=>{
                    let that = Array.from(document.getElementById('hdtb-msb-vis').querySelectorAll('a'))
                    if (!that[0] || that[0].innerText !== 'News') {
                        console.log('no news')
                        return false
                    } else {
                        that[0].click()
                        return true
                    }
                })
                if (!that) {
                    continue
                }
                let a2
                await tryx('//*[@id="hdtb-tls"]', time).then(result => {
                    if (!result){
                        a2 = false
                    } else {
                        a2 = true
                    }
                }).catch(e => {
                    a2 = false
                })
                if (!a2) {
                    continue
                }
                let search = await page1.evaluate(()=>{
                    const w = function(){
                        return new Promise((teed) => {
                            setTimeout(function(){
                                return teed()
                            }, 650);
                        })
                    }
                    return new Promise((res) => {     
                        w().then(il => {
                            document.querySelector('#main').querySelector('g-header-menu').parentElement.nextElementSibling.firstElementChild.nextElementSibling.click()
                            w().then(il=>{
                                let buts = Array.from(document.querySelector('#top_nav').querySelector('#hdtbMenus').querySelectorAll('.hdtb-mn-hd'))
                                let findbut
                                for (i = 0; i < buts.length; i++){
                                    if (buts[i].getAttribute(['aria-label']) === 'Recent') {
                                        findbut = buts[i]
                                        i = buts.length
                                    }
                                }
                                findbut.click()
                                w().then(il => {
                                    let multi = Array.from(findbut.nextElementSibling.querySelectorAll('a'))
                                    multi[1].click()
                                    return res(true)
                                })
                            }).catch(e => {
                                return rej(null)
                            })
                        }).catch(e => { return rej(null) }) 
                    })
                })
                if (!search) {
                    continue
                }
                let x3 = '//*[@id="rso"]/div[2]/g-card/div/div/div[2]/a/div/div[2]/div[3]/div[1]'
                let awa
                await tryx(x3, time).then(res => {
                    if (!res) {
                        awa = false
                    } else {
                        awa = true
                    }
                }).catch(e => {
                    console.log(e)
                    awa = false
                })
                if (!awa){
                    continue
                }
                let info = await page1.evaluate(()=>{
                    return new Promise((res) => {
                        w = function(){
                            return new Promise((teed) => {
                                setTimeout(function(){
                                    return teed()
                                }, 650);
                            })
                        }
                        w().then(il=>{
                            let results = Array.from(document.getElementById('rso').querySelectorAll('g-card'))
                            let articles = []
                            for (a = 0; a < results.length; a++){
                                let t = results[a]
                                let link = t.querySelector('a').href
                                let author = t.querySelector('.XTjFC').innerText
                                let title = t.querySelector('.nDgy9d').innerHTML
                                let date = t.querySelector('.YCV9ed').lastElementChild.innerHTML
                                let d = {
                                    link: link,
                                    author: author,
                                    title: title,
                                    date: date
                                }
                                articles.push(d)
                                if (a === results.length - 1) {
                                    return res(articles)
                                }
                            }
                        })
                    })
                })
                news.push({topic: topics[i], info: info})
            }
            console.log('got news from google for each topic: ' + JSON.stringify(news))
            let collection = new News({
                _id: new mongo.Types.ObjectId(),
                user: user.email,
                topics: topics,
                date: new Date().toISOString(),
                news: news
            })
            await browser.close()
            collection.save().then((collected) => {
                console.log('saved collection = ' + collected)
                addCollection(user, collected).then((result) => {
                    if (!result) {
                        return failedtogetthenews(false)
                    } else {
                        let newsbody
                        if (collected.news.length < 1) {
                            newsbody = `<div style="width: 100%; background-color: black; color: white; font-size: 18px; text-transform: uppercase; text-align: center;">Sorry No News...</div>`
                        } else {
                            newsbody = ''
                            let template = function(news) {
                                return `<div style="width: 100%; height: auto; margin: 10px 0px; display: inline-flex; align-items: space-around;">
                                    <div style="width: 75%; padding: 10px;"><div style="display: inline-flex; flex-direction: column; text-align: center;"><div style="font-size: 15px; text-transform: uppercase;">${news.title}</div><div style="font-size: 9px;">${news.author}, ${news.date}</div></div></div> <a href="${news.link}"><div style="text-decoration: none!important; font-size: 10px; font-weight: 800; background-color: black; margin: 0px 10px; color: white; text-align: center; padding: 14px; border-radius: 50px;">READ</div></a>
                                </div>`
                            }
                            collected.news.forEach(article => {
                                newsbody += `<h2 style="width: 100%; background-color: black; color: white; text-align: center;">${article.topic}</h2>`
                                article.info.forEach(child => {
                                    newsbody += template(child)
                                })
                                
                            })
                        }
                        sendEmail(user.email, `GOOD MORNING ${user.username}, here is todays news for your topics: ${JSON.stringify(topics)}.`, newsbody).then(sent => {
                            if (sent) {
                                console.log(sent)
                                return gotthenews(true)
                            } else {
                                console.log('failed to send news')
                                return failedtogetthenews(null)
                            }
                        }).catch(e => {
                            return failedtogetthenews(e)
                        })
                    }
                }).catch(e => {
                    return failedtogetthenews(e)
                })
            }).catch(e => {
                return failedtogetthenews(e)
            })
        }).catch(e => {
            return failedtogetthenews(e)
        })
    });
}
notifysam = function(err){
    sendEmail(process.env.ADMINEMAIL, '- IDM NEWSBOT - ALERT - URGENT - ERROR PROVIDING NEWS TO USERS', err)
}
sendStats = function(){
    Visitor.find({}, async (err, visi) => {
        if (err) {
            return notifysam(err)
        }
        if (!visi) {
            return null
        }
        if (visi) {
            let total = visi.length
            let pagevisits = 0
            for (i = 0; i < total; i++) {
                pagevisits += visi[i].visits
            }
            let topics = await News.find({}, (err, news) => {
                if (err) {
                    notifysam('ISSUE WITH GATHERING RECENT TOPICS ' + err)
                    return null
                }
                if (!news) {
                    return null
                }
                if (news) {
                    let top = []
                    for (i = 0; i < news.length; i++)  {
                        news[i].topics.forEach(topic => {
                            if (!top.includes(topic)) {
                                top.push(topic)
                            }
                        })
                    }
                    return top
                }
            })
            if (topics) {
                return sendEmail(process.env.ADMINEMAIL, 'DAILY VISITOR COUNTS', `TOTAL VISITORS: ${total}, TOTAL PAGE VISITS: ${pagevisits}, TOPICS THAT HAVE BEEN SEARCHED: ${JSON.stringify(topics)}`)
            } else {
                return sendEmail(process.env.ADMINEMAIL, 'DAILY VISITOR COUNTS, ERR WITH TOPICS', `TOTAL VISITORS: ${total}, TOTAL PAGE VISITS: ${pagevisits}`)
            }
        }
    })
}
provide = function(){
    User.find({}, (err, users) => {
        if (err) {
            console.log(err)
            return notifysam(err)
        }
        for(i = 0; i < users.length; i++) {
            getNews(users[i], users[i].topics).catch(e => {
                console.log(e)
                notifysam(e)
            })
        }
        return sendEmail(process.env.ADMINEMAIL, `SENT ${users.length} USERS THEIR NEWS TODAY!`, 'You got them the news today. You Rock!')
    })
}
module.exports = {
    getNews: getNews,
    provide: provide,
    notifysam: notifysam,
    sendStats: sendStats
}