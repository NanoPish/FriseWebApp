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
    var lol_events = [];
    
    connection.connect();

    connection.query('SELECT * FROM events', function(err, rows, fields) {
        if (err) {
            res.status(500).json({"status_code": 500,"status_message": "internal server error"})
        } else {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].source === "wikipedia" && (i % 300) === 0) 
                    wiki_events.push(rows[i]);
                else if (rows[i].source === "panda_score")
                    lol_events.push(rows[i]);
            }

            i = 0;

            var wiki_data = [];
            var lol_data = [];

            while (i < wiki_events.length) {
                var event = {};
                event['id'] = i;
                event['content'] = wiki_events[i].description;
                event['start'] =wiki_events[i].date;
                wiki_data[i] = event;
                i++;
            }

            i = 0;

            while (i < lol_events.length) {
                event = {};
                event['id'] = i;
                event['content'] = lol_events[i].description;
                event['start'] =lol_events[i].date;
                lol_data[i] = event;
                i++;
            }

            var lol_dataset = new vis.DataSet(lol_data);

            res.render('index.ejs', { title: 'Le Frise',
                                      wiki_data: wiki_data,
                                      lol_dataset: lol_dataset });
        }
    });
    
    connection.end();
});

module.exports = router;
