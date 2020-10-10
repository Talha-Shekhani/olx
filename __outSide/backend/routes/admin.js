const con = require("../connection");
const express = require('express')
const bodyParser = require('body-parser');
// const connection = require("../connection");

const Admin = express.Router()
Admin.use(bodyParser.urlencoded({ extended: true }))
Admin.use(bodyParser.json())

Admin.route('/')
    .get((req, res, next) => {
        let rslt = {}
        con.query("SELECT COUNT(*) AS tAds FROM ads", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                res.statusCode = 200
                rslt.tAds = result[0].tAds
            }
        })
        con.query("SELECT COUNT(*) AS tUsers FROM users", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                res.statusCode = 200
                rslt.tUsers = result[0].tUsers
            }
        })
        setTimeout(() => {
            console.log(rslt)
            res.send(rslt)
        }, 1000);


    })
    .post((req, res, next) => {
        res.end(`Will add the dish: ${req.body.name} with details: ${req.body.description}`)
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        console.log(req.body)
        con.query(`DELETE FROM ads where id = ${req.body.adId}`, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                // console.log('result: ', result)
                res.send({ success: true, result: result })
            }
        })
    })

Admin.get('/totalAds', (req, res) => {
    con.query(`SELECT COUNT(*) AS tAds, created_date AS date FROM ads GROUP BY created_date ORDER BY created_date `, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            // console.log('result: ', result)
            res.send(result)
        }
    })
})

Admin.get('/revenue', (req, res) => {
    let rslt = {}
    con.query(`SELECT SUM(amount) AS revenue, method FROM transactions GROUP BY method`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            // console.log('result: ', result)
            rslt.byMethod = result
        }
    })
    con.query(`SELECT sum(amount) AS revenue, bank_name AS bankName FROM transactions WHERE method != 'easypaisa' GROUP BY bank_name`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            // console.log('result: ', result)
            rslt.byBank = result
        }
    })
    setTimeout(() => {
        res.send(rslt)
    }, 1000);
})

Admin.get('/adsDetail', (req, res) => {
    con.query(`SELECT *, t.id AS tId FROM ads AS a, transactions AS t, users AS u WHERE a.user_id = u.id AND a.id = t.ad_id`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            // console.log('result: ', result)
            res.send(result)
        }
    })
})

Admin.put('/putPaid', (req, res) => {
    console.log(`UPDATE ads SET paid = '${req.body.paid}' WHERE id = ${req.body.adId}`)
    con.query(`UPDATE ads SET paid = '${req.body.paid}' WHERE id = ${req.body.adId}`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            console.log('result: ', result)
            res.send({ success: true, result: result })
        }
    })
})

Admin.get('/:startDate/:endDate', (req, res) => {
    con.query(`SELECT COUNT(*) AS tPAds, updated_date AS date FROM ads WHERE updated_date BETWEEN '${req.params.startDate}' AND '${req.params.endDate}' GROUP BY updated_date ORDER BY updated_date`, (err, result) => {
        if (err) {
            console.log("error: ", err);
            res.statusCode = 403
            res.send(err)
        }
        else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            console.log('result: ', result)
            res.send(result)
        }
    })
})

module.exports = Admin