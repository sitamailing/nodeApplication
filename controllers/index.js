var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var connection = req.connectionDB;
  connection.connect();
  connection.query('SELECT * from user', function(err, rows, fields) {
    res.render('index', {
      title: 'Node Application',
      users : rows
    });

    if (!err)
      console.log('The solution is: ', rows);
    else
      console.log('Error while performing Query.');
  });
  //connection.end();
});

module.exports = router;
