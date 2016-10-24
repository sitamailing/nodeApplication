var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var csv = require('csv-parser');
var userRepo = require('../repository/usersRepository');

// GET New User page
router.get('/add', function (req, res) {
    res.render('users/add', {title: 'Add New User'});
});

// POST to Add User
router.post('/add', function (req, res) {
    // Validation
    req.check('name', 'Name is required.').notEmpty();
    req.check('email', 'Invalid email address.').notEmpty().withMessage('Email is required.').isEmail();
    req.check('address', 'Address is required.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('users/add', {
            errors: errors
        });
    }

    var post = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    };
    // Save User
    userRepo.save(post)
        .then(function () {
            req.flash('success_msg', 'Added successfully.');
            res.redirect('/');
        })
        .catch(function (error) {
            return res.send({
                message: "Something went wrong while adding user."
            });
        });
});

// Delete a User
router.get('/delete/:id', function (req, res) {
    userRepo.delete(req.params.id)
        .then(function () {
            req.flash('success_msg', 'Deleted successfully.');
            res.redirect('/');
        })
        .catch(function (error) {
            return res.send({
                message: "Something went wrong while deleting user."
            });
        });
});

// Upload Bulk Users
router.get('/upload', function (req, res) {
    res.render('users/upload', {title: 'Upload Users'});
});

// POST to Add Bulk Users
router.post('/upload', function (req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        //Path where file will be uploaded
        fstream = fs.createWriteStream(__dirname + '/../uploads/' + filename);
        file.pipe(fstream);
        var csvData = [];
        fs.createReadStream(__dirname + '/../uploads/' + filename)
            .pipe(csv())
            .on('data', function (csvrow) {
                csvData.push(csvrow);
            })
            .on('end', function () {
                userRepo.bulkCreate(csvData)
                    .then(function () {
                        req.flash('success_msg', 'Uploaded successfully.');
                        res.redirect('/');
                    })
                    .catch(function (error) {
                        return res.send({
                            message: "Something went wrong while uploading users."
                        });
                    });
                res.redirect('/');
            });
    });
});

// Update Page for a User
router.get('/update/:id', function (req, res) {
    userRepo.findById(req.params.id)
        .then(function (user) {
            if (user) {
                res.render('users/update', {title: 'Update a User', user: user, buttonName: 'Update'});
            } else {
                res.redirect('/');
            }
        })
        .catch(function (error) {
            return res.send({
                message: "Something went wrong while selecting user."
            });
        });
});

// Update a User
router.post('/update/:id', function (req, res) {
    // Validation
    req.check('name', 'Name is required.').notEmpty();
    req.check('email', 'Invalid email address.').notEmpty().withMessage('Email is required.').isEmail();
    req.check('address', 'Address is required.').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('users/update', {
            errors: errors
        });
    }

    var post = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    };
    // Update a User
    userRepo.update(post, {iduser: req.params.id})
        .then(function () {
            req.flash('success_msg', 'Updated successfully.');
            res.redirect('/');
        })
        .catch(function (error) {
            return res.send({
                message: "Something went wrong while updating a user."
            });
        });
});


module.exports = router;
