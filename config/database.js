// Mysql database
var mysql = require('mysql');
// Established a mysql database connection
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password123',
    database : 'node_application'
});
// Check database connection
connection.connect(function(err){
    if(!err) {
        console.log("Database is connected.");
    } else {
        console.log("Failed to connect database.");
    }
});

module.exports = connection;