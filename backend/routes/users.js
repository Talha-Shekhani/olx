const express = require('express')
const bodyParser = require('body-parser');
const con = require("../connection");
const bcrypt = require('bcrypt');
const { isEmpty } = require('react-native-validator-form/lib/ValidationRules');
const saltRounds = 10;

const user = express.Router()
user.use(bodyParser.json())

user.route('/')
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        con.query("SELECT * FROM users", (err, result) => {
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
        res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`)
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting all the dishes!`)
    })

user.route('/:userKey')
    .get((req, res, next) => {
        con.query(`SELECT * FROM users where id='${req.params.userKey}' OR email='${req.params.userKey}'`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                // console.log("userId: ", result);
                res.statusCode = 200
                res.send(result)
            }
        })
    })
    .post((req, res, next) => {
        res.statusCode = 403
        res.end(`POST operation not supported on /dishes/${req.params.dishId}`)
    })
    .put((req, res, next) => {
        res.write(`Will updating the dish: ${req.params.dishId}\n`)
        res.end(`Will update the dish: ${req.body.name} with details: ${req.body.description}`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting the dish: ${req.params.dishId}`)
    })

user.route('/:email/:password')
    .get((req, res, next) => {
        const hash = bcrypt.hashSync(req.params.password, saltRounds)
        // console.log(bcrypt.compareSync(req.params.password, hash), hash)
        con.query(`SELECT * FROM users where email='${req.params.email}'`, (err, result) => {
            if (err) {
                console.log("error: ", err)
                res.send(err)
            }
            else {
                console.log(req.params.password, req.params.email, 'cehck')
                if (!isEmpty(result))
                    if (bcrypt.compareSync(req.params.password, result[0].password) == true)
                        res.send(true)
                    else res.send(false)
                else res.send(false)
            }
        })
    })

user.route('/chat/user/:userId')
    .get((req, res) => {
        con.query(`SELECT DISTINCT from_user_id, to_user_id FROM chats WHERE from_user_id = ${req.params.userId} ORDER BY createdAt DESC`, (err, result) => {
            if (err) {
                console.log("error: ", err)
                res.statusCode = 403
                res.send(err)
            }
            else {
                // res.statusCode = 200
                // res.setHeader('Content-Type', 'application/json')
                for (var i in result) {
                    console.log(result[i].from_user_id)
                    con.query(`SELECT * FROM chats where from_user_id = ${result[i].from_user_id} AND to_user_id = ${result[i].to_user_id} ORDER BY createdAt DESC LIMIT 1`, (err, reslt) => {
                        if (err) console.log(err)
                        else {
                            console.log(reslt)
                            // .set({'Content-Type': 'application/json'})
                            res.send(reslt)
                        }
                    })
                }
            }
        })
    })

module.exports = user