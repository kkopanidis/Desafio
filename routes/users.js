"use strict";
const express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    userInfo = require('../models/userInfo'),
    Token = require('../models/accessToken'),
    TokenRef = require('../models/refreshToken'),
    Connect = require('../models/connections'),
    passport = require('passport');

//Register new user
router.post('/register', function (req, res, next) {

    if (!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("password") || !req.body.hasOwnProperty("dob")) {

        next();
        return;
    }

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
    Token.findOne({userId: req.user.userId})
        .exec()
        .then(function (token) {
            if (!token) {
                res.status(200).send();
            }
            else {
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
        }).catch(next)
});

//Connect/disconnect with a user
router.post('/connect/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (req.params.id("username") !== "" || req.params.id < 12) {
        next();
        return;
    }

    Connect.findOne({follower: req.user.userId, followee: req.params.id})
        .exec()
        .then(function (connection) {
            if (connection) {
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
        }).catch(next);
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

function sendUserData(res, user) {
    if (user.info)
        res.json({
            email: user.email,
            username: user.username,
            firstname: user.info.firstname,
            lastname: user.info.lastname,
            dob: user.dob,
            denarious: user.info.denarious,
            id: user._id
        });
    else {
        res.json({
            email: user.email,
            username: user.username,
            dob: user.dob,
            id: user._id
        });
    }
}

/* GET user info*/
router.get('/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    if (req.params.id === "") {
        res.status(500).send(err);
        return;
    }
    if (req.params.id === "notif") {
        next();
        return;
    }
    User.findById(req.params.id)
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Nothing found"
            } else {
                sendUserData(res, result)
            }
        })
        .catch(next);

});

router.get('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    req.user.populate('info', function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            sendUserData(res, req.user)
        }
    });


});

/* Update user info*/
router.post('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (!req.body.hasOwnProperty("username") ||
        !req.body.hasOwnProperty("firstname") ||
        !req.body.hasOwnProperty("lastname")) {

        next();
        return;
    }
    req.user.populate('info', function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            if (!req.user.info) {
                req.user.info = new userInfo({});
            }
            req.user.username = req.body.username;
            req.user.info.firstname = req.body.firstname;
            req.user.info.lastname = req.body.lastname;
            req.user.info.save(function (err) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    req.user.save(function (err) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(200).send("OK");
                        }
                    });
                }
            });
        }
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
