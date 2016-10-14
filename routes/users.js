"use strict";
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/accessToken');
var TokenRef = require('../models/refreshToken');
var passport = require('passport');

//Register new user
router.post('/register', function (req, res, next) {
    new User({
        email: req.body[0],
        username: req.body[1],
        password: req.body[2],
        dob: req.body[3]
    }).save(function (err, result) {
        if (err || !result) {
            res.status(500).send(err);
        } else {
            res.status(200).send("Success!");
        }

    });

});

router.post('/logout', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    Token.findOne({userId: req.user.userId}, function (err, token) {
        if (err) {
            res.status(500).send(err);
        } else {
            token.remove();
            TokenRef.findOne({userId: req.user.userId}, function (err, tokenRef) {
                if (err || !tokenRef) {
                    res.status(500).send(err === null ? err : "error occurred");
                } else {
                    tokenRef.remove();
                    res.status(200).send("logged out");
                }
            });
        }
    });


});

/* GET specific user info */
router.get('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    res.json({
        email: req.user.email,
        username: req.user.username
    });
});
module.exports = router;
