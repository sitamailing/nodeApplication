var express = require('express');
// get an instance of the express Router
var router = express.Router();

var userRepo = require('../repository/usersRepository');

// GET Home Page
router.get('/', function (req, res, next) {
    userRepo.findAll()
        .then(function (users) {
            res.render('index', {
                title: 'Node Application',
                users: users
            });
        })
        .catch(function (error) {
            return res.send({
                message: "Error retrieving user."
            });
        });
});

module.exports = router;
