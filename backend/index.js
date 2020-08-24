// const conn = require('./connection.js')
const express = require('express')
const http = require('http')
const morgan = require('morgan')
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/ads', Ads)
app.use('/fetchSubcat', Subcat )
app.use('/fetchCat', Cat )
app.use('/loc', loc )
app.use('/users', user )
app.use('/favorite', favorites )
app.use(express.static(__dirname+ '/assets/images'))
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