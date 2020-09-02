// const conn = require('./connection.js')
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const con = require("./connection");
const bodyParser = require('body-parser')
const Ads = require('./routes/ads')
const Cat = require('./routes/categories')
const Subcat = require('./routes/subCategories')
const loc = require('./routes/location')
const user = require('./routes/users')
const favorites = require('./routes/favorites')

// const hostname = '192.168.0.105'
const hostname = 'localhost'
const port = 3000
// const port = 8080

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/ads', Ads)
app.use('/fetchSubcat', Subcat)
app.use('/fetchCat', Cat)
app.use('/loc', loc)
app.use('/users', user)
app.use('/favorite', favorites)
app.put('/setStatus', (req, res) => {
    console.log(req.body)
    let stat = req.body.active == 'true' ? 'false' : 'true'
    console.log(stat)
    let dat = new Date()
    console.log(`UPDATE ads set active = '${stat}', updated_date = '${dat.toISOString()}' where user_id = ${req.body.userId} AND id = ${req.body.adId}`)
    con.query(`UPDATE ads set active = '${stat}', updated_date = '${dat.toISOString()}' where user_id = ${req.body.userId} AND id = ${req.body.adId}`, (err, result) => {
        if (err) {
            res.statusCode = 403
            console.log("error: ", err)
        }
        else {
            console.log(result)
            res.send(true)
        }
    })
})
app.use(express.static(__dirname + '/assets/images'))

setInterval(() => {
    const dat = new Date()
    dat.setHours(24, 0, 0, 0)
    dat.setDate(dat.getDate() + 30)
    con.query(`DELETE FROM ads where updated_date = '${dat.toISOString().slice(0, 10)}'`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            console.log(err)
        }
        else {
            console.log(result)
        }
    })
}, 1000 * 60 * 60 * 24)
app.use((req, res, next) => {
    console.log(req.headers)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')
    res.end(`<html><body><h1>This is an Express Server</h1></body></html>`)
})

const server = http.createServer(app)

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})