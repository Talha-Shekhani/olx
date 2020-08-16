let mysql = require('mysql')
let fs = require('fs')

// pool = mysql.createPool({
//     host: '145.14.144.52',
//     host: 'databases.000webhost.com',
//     user: 'id10416239_admin',
//     password: 'Talha1999T.S',
//     database: 'id10416239_olx'
// })
pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'olx'
})

pool.getConnection(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
    return pool
})

module.exports = pool