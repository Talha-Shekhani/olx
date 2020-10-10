var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const http = require('http')
const nodemailer = require('nodemailer')

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
const config = require('./config')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/sendCode', (req, res) => {
    console.log(req.body)
    var transporter = nodemailer.createTransport({
        host: 'mail.cacmarket.com',
        mailer: 'smtp',
        port: 465,
        tls: true,
        rejectUnauthorized: false,
        auth: {
            user: config.module.mail,
            pass: config.module.pass
        }
    });

    var mailOptions = {
        from: config.module.mail,
        to: `${req.body.email}`,
        subject: 'Sending Email using Node.js',
        text: `Verification Code: ${req.body.code}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            res.send({success: false, error: error.toString()})
        } else {
            console.log('Email sent: ' + info.response)
            res.send({success: true})
        }
    });
})

setInterval(() => {
    const dat = new Date()
    dat.setHours(24, 0, 0, 0)
    dat.setDate(dat.getDate() + 30)
    console.log(dat.toISOString().slice(0,10))
    con.query(`DELETE FROM ads where updated_date LIKE '${dat.toISOString().slice(0, 10)}%' AND type = 'basic'`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            console.log(err)
        }
        else {
            console.log(result)
        }
    })
}, 1000 * 60 * 60 * 24)
setInterval(() => {
    const dat = new Date()
    dat.setHours(24, 0, 0, 0)
    dat.setDate(dat.getDate() + 180)
    con.query(`DELETE FROM ads where updated_date LIKE '${dat.toISOString().slice(0, 10)}%' AND type = 'premium'`, (err, result) => {
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
    res.send({ data: 'not found' })
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
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};
const clients = {}
wsServer.on('request', (request) => {
    console.log('req')
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    const conn = request.accept(null, request.origin)
    clients[userID] = conn
    // console.log(clients)
    // console.log(conn)
    conn.on('message', (msg) => {
        console.log('serversidemsg:', msg)
        if (msg.type === 'utf8')
            console.log('Recieved message: ', msg.utf8Data)
        for (key in clients) {
            clients[key].sendUTF(msg.utf8Data)
            // console.log('Send msgs to ', clients[key])
        }
    })
})
wsServer.on('connect', (req) => {
    console.log('connect')
})
wsServer.on('close', (conn, reason, desc) => {
    console.log('close')
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
