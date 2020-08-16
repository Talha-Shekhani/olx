const express = require('../node_modules/express')
const bodyParser = require('../node_modules/body-parser');
const con = require("../connection");

const Subcat = express.Router()
Subcat.use(bodyParser.json())

Subcat.route('/')
.all((req, res, next) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    next()
})
.get((req, res, next) => {
        con.query("SELECT * FROM subcategories", (err, result) => {
            if (err) {
              console.log("error: ", err);
              res.send(err)
            }
            else {
            // console.log("cat: ", result);
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

module.exports = Subcat