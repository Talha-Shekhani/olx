const express = require('express')
const bodyParser = require('body-parser');
const con = require("../connection");

const rev = express.Router()
rev.use(bodyParser.json())

rev.route('/')
    .get((req, res, next) => {
        // con.query(`SELECT * FROM review WHERE ad_id = ${req.body.adId}`, (err, result) => {
        //     if (err) {
        //         console.log("error: ", err);
        //         res.send({err: err})
        //     }
        //     else {
        //         // console.log("loc: ", result);
        //         res.statusCode = 200
        //         res.setHeader({'Content-Type': 'application/json'})
        //         res.send({success: true, result: result})
        //     }
        // })
    })
    .post((req, res, next) => {
        console.log(req.body)
        con.query(`INSERT INTO review (user_id, ad_id, rating, review) 
        VALUES (${req.body.userId},${req.body.adId},${req.body.rating},'${req.body.review}')`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.send(err)
            }
            else {
                // console.log("loc: ", result);
                res.send({ success: true, response: result })
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

rev.get('/:adId', (req, res) => {
    con.query(`SELECT u.name, u.img, r.rating, r.review, r.date_time FROM review r, users u WHERE r.user_id = u.id AND ad_id = ${req.params.adId}`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.send({ err: err })
        }
        else {
            // console.log("loc: ", result);
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send({ success: true, result: result })
        }
    })
})

rev.get('/user/:userId', (req, res) => {
    con.query(`SELECT r.ad_id, a.title, u.name, u.img, r.rating, r.review, r.date_time FROM review r, users u, ads a WHERE r.user_id = u.id AND a.id = r.ad_id AND r.user_id = ${req.params.userId}`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.send({ err: err })
        }
        else {
            console.log("result ", result);
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.send({ success: true, result: result })
        }
    })
})

module.exports = rev