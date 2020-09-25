// const conn = require('./connection.js')
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const con = require("./connection");
const bodyParser = require('body-parser')
const webSocketServer = require('websocket').server;
const wsClient = require('websocket').w3cwebsocket;
const Ads = require('./routes/ads')
const Cat = require('./routes/categories')
const Subcat = require('./routes/subCategories')
const loc = require('./routes/location')
const user = require('./routes/users')
const favorites = require('./routes/favorites');
const Chats = require('./routes/chats');
const rev = require('./routes/review');
const feature = require('./routes/featured');
const Admin = require('./routes/admin')
const cors = require('cors')

// const hostname = '192.168.0.105'
const hostname = '127.0.0.1'
const port = 3000

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/ads', Ads)
app.use('/fetchSubcat', Subcat)
app.use('/fetchCat', Cat)
app.use('/loc', loc)
app.use('/users', user)
app.use('/favorite', favorites)
app.use('/chat', Chats)
app.use('/review', rev)
app.use('/feature', feature)
app.use('/admin', Admin)
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
    con.query(`DELETE FROM ads where updated_date = '${dat.toISOString().slice(0, 10)}' AND type = 'basic'`, (err, result) => {
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
    res.setHeader('Content-Type', 'application/json')
    res.send({data: 'not found'})
})

const server = http.createServer(app)

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`)
})

const webSocketsServerPort = 8000
const serve = http.createServer()
let hstname = '127.0.0.1'
serve.listen(webSocketsServerPort, hstname, () => {
    // console.log(`Server running at http://${hostname}:${port}`)
    console.log(`Server running at wss://${hstname}:${webSocketsServerPort}`)
    console.log(serve.address())
})
const wsServer = new webSocketServer({
    httpServer: serve
})

// const wsServer = new webSocketServer({
//     httpServer: server
// });
wsServer.on('request', (request) => {
    console.log('req')
    const conn = request.accept(null, null)
    // console.log(conn)
    conn.on('message', (msg) => {
        console.log(msg)
    })
})
wsServer.on('connect', (req) => {
    console.log('connect')
    // const conn = req.accept(null, '*')
    // console.log(conn)
    // conn.on('message', (msg) => {
    //     console.log(msg)
    // })
})
wsServer.on('close', (conn, reason, desc) => {
    console.log('close')
})

// setInterval(() => {
//     var sock = new wsClient('ws://127.0.0.1:8000')
//     sock.onopen = () => console.log('open')
//     sock.onerror = (err) => console.log('err')
//     sock.onclose = (event) => console.log('close: ', event.reason, event.code, event.wasClean)
// }, 3000);