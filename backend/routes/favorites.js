const express = require('../node_modules/express')
const bodyParser = require('../node_modules/body-parser');
const con = require("../connection");
const bcrypt = require('bcrypt');
const { isEmpty } = require('react-native-validator-form/lib/ValidationRules');
const saltRounds = 10;

const favorite = express.Router()
favorite.use(bodyParser.json())

favorite.route('/')
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        con.query("SELECT * FROM favorite", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.send(err)
            }
            else {
                // console.log("cat: ", result);
                res.send(result)
            }
        })

    })
    .post((req, res, next) => {
        // con.query("INSERT INTO favorite values ", (err, result) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         res.statusCode = 403
        //         res.send(err)
        //     }
        //     else {
        //         // console.log("cat: ", result);
        //         res.send(result)
        //     }
        // })
        res.end(`POST operation on Favorites`)
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting all the dishes!`)
    })

favorite.route('/:userKey')
    .get((req, res, next) => {
        con.query(`SELECT * FROM favorite where user_id=${req.params.userKey}`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.send(err)
            }
            else {
                // console.log("userId: ", result);
                res.send(result)
            }
        })
    })

favorite.route('/:userKey/:adKey')
    .get((req, res, next) => {
        // con.query(`SELECT * FROM users where id='${req.params.userKey}' OR email='${req.params.userKey}'`, (err, result) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         res.send(err)
        //     }
        //     else {
        //         // console.log("userId: ", result);
        //         res.send(result)
        //     }
        // })
        res.end(`GET operation on Favorite/`)
    })
    .post((req, res, next) => {
        con.query(`INSERT INTO favorite values (${req.params.userKey}, ${req.params.adKey}) `, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                // console.log("cat: ", result);
                res.send(result)
            }
        })
    })
    .put((req, res, next) => {
        res.write(`Will updating the dish: ${req.params.dishId}\n`)
        res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
    })
    .delete((req, res, next) => {
        con.query(`DELETE FROM favorite where user_id = ${req.params.userKey} AND ad_id = ${req.params.adKey}`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                // console.log("cat: ", result);
                res.send(result)
            }
        })
    })

module.exports = favorite