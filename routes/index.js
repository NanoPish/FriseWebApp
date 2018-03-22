var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var vis = require('vis')

/* GET home page. */
router.get('/', function(req, res, next) {

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'lafrise',
        password : 'lafrise',
        database : 'lafrise'
    });

    var wiki_events = [];
    var dota_events = [];

    connection.connect();

    connection.query('SELECT * FROM events', function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error"})
        } else {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].source === "wikipedia" && (i % 300) === 0)
                    wiki_events.push(rows[i]);
                else if (rows[i].source === "panda_score")
                    dota_events.push(rows[i]);
            }

            i = 0;
            var u = 0;

            var wiki_data = [];
            var dota_data = [];

            while (i < wiki_events.length) {
              if (i % 10 === 0) {
                var event = {};
                event['id'] = i;
                event['content'] = wiki_events[i].description;
                event['start'] = wiki_events[i].date;
                wiki_data[u] = event;
                u++;
              }
              i++;
            }

            i = 0;

            while (i < dota_events.length) {
                event = {};
                event['id'] = i;
                event['content'] = dota_events[i].description;
                event['start'] =dota_events[i].date;
                dota_data[i] = event;
                i++;
            }


            res.render('index.ejs', { title: 'Le Frise',
                                      wiki_data: wiki_data,
                                      dota_data: dota_data });
        }
    });

    connection.end();
});

module.exports = router;
