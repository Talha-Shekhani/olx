const con = require("../connection");
const express = require('express')
const bodyParser = require('body-parser');

const Chats = express.Router()
// Chats.use(bodyParser.urlencoded({ extended: true }))
Chats.use(bodyParser.json())

Chats.route('/')
    .get((req, res, next) => {
        // con.query("SELECT * FROM ads", (err, result) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         res.statusCode = 403
        //         res.send(err)
        //     }
        //     else {
        //         // console.log("ads: ", result);
        //         res.send(result)
        //     }
        // })

    })
    .post((req, res, next) => {
        console.log(req.body)
        con.query(`INSERT INTO chats(_id, createdAt, text, to_user_id, from_user_id) 
        VALUES ('${req.body._id}',
        '${req.body.createdAt}',
        '${req.body.text}',
        ${req.body.user._id},
        ${req.body.from_user_id})`,
            (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    res.statusCode = 403
                    res.send(err)
                }
                else {
                    // console.log("ads: ", result);
                    res.send(true)
                }
            })
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting all the dishes!`)
    })

Chats.get('/:from_user/:to_user', (req, res) => {
    console.log(`SELECT * FROM chats where from_user_id IN (${req.params.from_user}, ${req.params.to_user}) AND to_user_id IN (${req.params.from_user}, ${req.params.to_user}) order by createdAt desc`)
    con.query(`SELECT * FROM chats where from_user_id IN (${req.params.from_user}, ${req.params.to_user}) AND to_user_id IN (${req.params.from_user}, ${req.params.to_user}) order by createdAt desc`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            for (let i in result) {
                result[i].user = {}
                result[i].user._id = result[i].to_user_id
            }
            console.log("res: ", result);
            res.send(result)
        }
    })

})

module.exports = Chats