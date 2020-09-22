const con = require("../connection");
const express = require('express')
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer')
// const connection = require("../connection");

const Ads = express.Router()
Ads.use(bodyParser.urlencoded({ extended: true }))
Ads.use(bodyParser.json())

Ads.route('/')
    .get((req, res, next) => {
        con.query("SELECT * FROM ads", (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
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
                console.log('result: ', result)
                res.send({ success: true, result: result })
            }
        })
    })

Ads.route('/:userId/form')
    .all((req, res, next) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        next()
    })
    .get((req, res, next) => {
        console.log('formData', req.params.userId, ' ', req.body)
        res.send(req.body)

    })
    .post((req, res, next) => {
        let dat = new Date()
        let img1 = '', img2 = '', img3 = ''
        img1 = req.body.img[0].uri.slice(req.body.img[0].uri.lastIndexOf('/') + 1)
        if (req.body.img[1] != undefined)
            img2 = req.body.img[1].uri.slice(req.body.img[1].uri.lastIndexOf('/') + 1)
        if (req.body.img[2] != undefined)
            img3 = req.body.img[2].uri.slice(req.body.img[2].uri.lastIndexOf('/') + 1)
        console.log(img1, img2, img3)
        console.log('formData', req.params.userId, ' ', req.body)

        // fs.copyFile(req.body.img[0].uri.replace('file://', ""), '../assets/images/', (err, res) => {
        //     if (err) console.log('err ', err)
        //     else console.log(contents)
        // })
        // fs.readFile(req.body.img[0].uri, (err, contents) => {
        //     if (err)
        //         console.log('err ', err)
        //     else console.log(contents)
        // })
        // res.send(req.body)

        con.query(`INSERT INTO ads 
        (user_id, title, description, price, category_id, sub_category_id, area_id, img1, img2, img3, created_date, updated_date, active, type, paid) 
        values (${req.params.userId}, 
            '${req.body.title}', 
            '${req.body.description}', 
            '${req.body.price}', 
            ${req.body.catId}, 
            ${req.body.subcatId}, 
            ${req.body.loc},
            '${img1}', 
            '${img2}',
            '${img3}',
            '${dat.toISOString()}', 
            '${dat.toISOString()}',
            'true',
            '${req.body.type}',
            '${req.body.paid}') `, (err, result) => {
            if (err) {
                console.log("error: ", err);
                res.statusCode = 403
                res.send(err)
            }
            else {
                if (req.body.transactionId != undefined)
                    con.query(`INSERT INTO transactions(id, date, ad_id, method, amount, bill_no, bank_name) 
                    VALUES (
                    ${req.body.transactionId},
                    '${req.body.tDate}',
                    ${result.insertId},
                    '${req.body.method}',
                    ${req.body.price},
                    ${req.body.billNo || null},
                    '${req.body.bankName}')`, (err, result) => {
                        if (err) {
                            console.log("error: ", err);
                            res.statusCode = 403
                            res.send(err)
                        }
                        else res.send(result)
                    })
            }
        })
        // res.send(req.body)
    })
    .put((req, res, next) => {
        res.statusCode = 403
        res.end(`PUT operation not supported on /dishes`)
    })
    .delete((req, res, next) => {
        res.end(`Deleting all the dishes!`)
    })

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './assets/images/')
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}`)
    },
})
const upload = multer({ storage: storage })

Ads.post('/upload', upload.array('img', 3), (req, res) => {
    // if (err) console.log('err ', err)
    // for (var i in req.files) {
    //     req.files[i].path = req.files[i].destination + req.files[i].originalname
    // }
    // console.log(req)
    // console.log(JSON.stringify(req.body))
    console.log(req.headers)
    // console.log(req.file)
    console.log(req.files)
    res.send(req.files)
})

module.exports = Ads