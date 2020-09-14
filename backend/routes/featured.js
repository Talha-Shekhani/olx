const express = require('express')
const bodyParser = require('body-parser');
const con = require("../connection");

const feature = express.Router()
feature.use(bodyParser.json())

feature.route('/')
    .get((req, res, next) => {
        // con.query(`SELECT * FROM featured WHERE user_id = $`, (err, result) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         res.send(err)
        //     }
        //     else {
        //         // console.log("cat: ", result);
        //         res.send(result)
        //     }
        // })
    })
    .post((req, res, next) => {
        con.query(`INSERT INTO featured values(
            ${req.body.userId},
            ${req.body.catId},
            '${req.body.dat}'
        ) `, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send({ err: err })
            }
            else {
                // console.log("cat: ", result);
                res.send({ success: true, result: result })
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

feature.get('/:userId', (req, res) => {
    con.query(`SELECT * FROM featured WHERE user_id = ${req.params.userId}`, (err, result) => {
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

module.exports = feature