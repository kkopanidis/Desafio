var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var schedule = require('node-schedule');
var scheduled = require('./logic/scheduled');
require('./auth/auth');

var routes = require('./routes/index');
var users = require('./routes/users');
var des = require('./routes/des');
var search = require('./routes/search');
var oauth2 = require('./auth/oauth2');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/users', users);
app.use('/api/des', des);
app.use('/api/search', search);
app.use('/api/oauth/token', oauth2.token);
app.use('/', routes);
schedule.scheduleJob(' */45 * * * *', scheduled.gaunlets);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


module.exports = app;
