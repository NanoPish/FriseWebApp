var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'lafrise',
        password : 'lafrise',
        database : 'lafrise'
    });

    var events = [];
    
    connection.connect();

    connection.query('SELECT * FROM events', function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error"})
        } else {
            console.log('First event is : ', rows[0]);
            for (var i = 0; i < rows.length; i++) {
                events.push(rows[i]);
            }
            res.render('index.ejs', { title: 'Express', events: events });
        }
    });
    
    connection.end();
});

module.exports = router;
