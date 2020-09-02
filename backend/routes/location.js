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
        con.query("SELECT l.id, l.c_id, area, city, province FROM location AS l, city AS c, province as p WHERE l.c_id = c.id AND c.p_id = p.id ", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.send(err)
            }
            else {
                // console.log("loc: ", result);
                res.send(result)
            }
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
    
loc.get('/province', (req, res) => {
    con.query("SELECT id, province FROM province", (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.send(err)
        }
        else {
            // console.log("loc: ", result);
            res.send(result)
        }
    })
})

loc.get('/city', (req, res) => {
    con.query("SELECT id, city, p_id FROM city", (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.send(err)
        }
        else {
            // console.log("loc: ", result);
            res.send(result)
        }
    })
})

module.exports = loc