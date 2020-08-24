const express = require('express')
const bodyParser = require('body-parser');
const con = require("../connection");

const loc = express.Router()
loc.use(bodyParser.json())

loc.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    next()
})
.get((req, res, next) => {
        con.query("SELECT * FROM location", (err, result) => {
            if (err) {
              console.log("error: ", err);
              res.send(err)
            }
            else {
            // console.log("loc: ", result);
            res.send(result)}
          })
    
})
.post((req, res, next) => {
    res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`)
})
.put((req, res, next) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /dishes`)
})
.delete((req, res, next) => {
    res.end(`Deleting all the dishes!`)
})

module.exports = loc