"use strict";
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Token = require('../models/accessToken');
var TokenRef = require('../models/refreshToken');
var Connect = require('../models/connections');
var passport = require('passport');

//Register new user
router.post('/register', function (req, res, next) {

    new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        dob: req.body.dob
    }).save(function (err, result) {
        if (err || !result) {
            res.status(500).send(err);
        } else {
            res.status(200).send("Success!");
        }

    });

});

//Destroy the tokens assigned to the user
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
//Connect/disconnect with a user
router.post('/connect/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    Connect.findOne({follower: req.user.userId, followee: req.params.id}, function (err, connection) {
        if (err) {
            res.status(500).send(err);
        } else if (connection) {
            connection.remove();
            res.status(200).send("Connection removed!");
        } else {
            User.findById(req.params.id)
                .exec(function (err, user) {
                    if (err || !user) {
                        res.status(500).send(err);
                    } else {
                        new Connect({
                            follower: req.user,
                            followee: user
                        }).save(function (err) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send("Done!");
                            }
                        })
                    }
                })
        }
    });
});

//get the total amount of followers
router.get('/connect', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    Connect.aggregate([
        {
            $match: {
                'followee': req.user._id
            }
        }, {
            $group: {
                _id: "$followee",
                follower: {$push: "$follower"},
                num: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            Connect.populate(result, {path: "follower"}, function (err, result) {
                if (err) {
                    res.status(500).json({
                        error: err
                    });
                } else {
                    res.status(200).json(result);
                }
            });

        }
    });
});


//Connect/disconnect with a user
router.get('/connect/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    Connect.findOne({follower: req.user.userId, followee: req.params.id}, function (err, connection) {
        if (err) {
            res.status(500).send(err);
        } else if (!connection) {
            res.status(200).send("Not followed");
        } else {
            res.status(200).send("followed");
        }
    });
});
/* GET user info*/
router.get('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    res.json({
        email: req.user.email,
        username: req.user.username,
        id: req.user._id
    });
});
/* GET notifications*/
router.get('/notif', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    req.user.populate('notifications', function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).json(result.notifications);
        }
    })
});

module.exports = router;
