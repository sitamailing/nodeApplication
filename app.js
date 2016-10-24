var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var flash = require('connect-flash');
var mysql = require('mysql');
var busboy = require('connect-busboy');

db = require('./models');

db.sequelize.sync()
    .catch(function (e) {
        throw new Error(e);
    });

// Mysql database connection
//var connectionDB = require('./config/database');

// Established a mysql database connection
//var connectionDB = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'password123',
//    database: 'node_application'
//});

var routes = require('./controllers/index');
var users = require('./controllers/users');

// Init App
var app = express();

// Environment
var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Set Static Folder (For Stylesheets, JavaScripts, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
// Note : Add after the body parser because it required body parser.
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Express Session
app.use(expressSession({secret: 'max', saveUninitialized: false, resave: false}));

// Connect Flash
app.use(flash());
// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // Passport sets its own flash message
    //res.locals.error = req.flash(error);
    next();
});

// Logger
app.use(logger('dev'));

// Connect Busboy for form/file upload
app.use(busboy());

// Make  db accessible to our router
//app.use(function (req, res, next) {
//    req.connectionDB = connectionDB;
//    next();
//});

app.use('/', routes);
app.use('/users', users);


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error Handlers
// Development Error Handler
// Note : will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production Error Handler
// Note : no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
