var express = require('express');
var router = express.Router();


var fs = require('fs-extra');
var csv = require('csv-parser');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET New User page. */
router.get('/add', function (req, res) {
    res.render('users/add', {title: 'Add New User', success: req.session.success, errors: req.session.errors});
    req.session.errors = null;
    req.session.success = null;
});

/* POST to Add User */
router.post('/addUser', function (req, res) {
    // Set our internal DB variable
    var connection = req.connectionDB;
    req.check('name','Name is required.').notEmpty();
    req.check('email', 'Invalid email address.').notEmpty().withMessage('Email is required.').isEmail();
    req.check('address','Address is required.').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        res.redirect('/users/add');
    }else{
        req.session.success = true;
    }

    var post = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    };
    connection.query('INSERT INTO user SET ?', post, function (error) {
        if (error) {
            res.send("There was a problem adding the information to the database.");
        } else {
            res.redirect('/users/upload');
        }
    });
});

/* Delete a User. */
router.get('/delete/:id', function (req, res) {
    var connection = req.connectionDB;
    var conn =connection.query('DELETE FROM user WHERE iduser = ?', req.params.id, function(error, result){
        if (error) {
            console.log(error);
            res.send("There was a problem while deleting the information from database.");
        } else {
            res.redirect('/users/upload');
        }
    });
});

/* Upload New User. */
router.get('/upload', function (req, res) {
    res.render('users/upload', {title: 'Upload Users'});
});

/* POST to Add Multiple Users */
router.post('/uploadUser', function (req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);


        //Path where file will be uploaded
        fstream = fs.createWriteStream(__dirname + '/../uploads/' + filename);
        file.pipe(fstream);

        var csvData = [];
        var connection = req.connectionDB;
        fs.createReadStream(__dirname + '/../uploads/' + filename)
            .pipe(csv())
            .on('data', function (csvrow) {

                var post = {
                    name: csvrow.name,
                    email: csvrow.email,
                    address: csvrow.address
                };
                //console.log(post);
                connection.query('INSERT INTO user SET ?', csvrow, function (error) {
                    if (error) {
                        console.log(error);
                        // If it failed, return error
                        //res.send("There was a problem adding the information to the database.");
                    } else {
                        console.log('done');
                        //req.flash('message', 'welcome key is present');
                    }
                });


                //do something with csvrow
                csvData.push(csvrow);
            })
            .on('end', function () {
                res.redirect('/users/upload');
            });
    });
});


module.exports = router;
