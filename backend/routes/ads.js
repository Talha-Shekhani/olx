const con = require("../connection");

// // constructor
// const Ads = function(ads) {
//     this.id = ads.id
// };
// alert('come')

// Ads.getAll = result => {
//     sql.query("SELECT * FROM ads", (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }

//       console.log("Ads: ", res);
//       result(null, res);
//     });
//   };

// module.exports = Ads

const express = require('express')
const bodyParser = require('body-parser');
const connection = require("../connection");

const Ads = express.Router()
Ads.use(bodyParser.json())

Ads.route('/')
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        con.query("SELECT * FROM ads", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.send(err)
            }
            else {
                // console.log("ads: ", result);
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

Ads.route('/:userId/:formData')
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        console.log(`Get ad `)

    })
    .post((req, res, next) => {
        console.log(req.params.formData)
        // con.query(`INSERT INTO ads (user_id, title, description, price, category_id, sub_category_id, img1) 
        // values (${req.params}, ${req.params.adKey}) `, (err, result) => {
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
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting all the dishes!`)
    })

module.exports = Ads