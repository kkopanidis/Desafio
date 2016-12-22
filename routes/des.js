var express = require('express');
var router = express.Router();
var passport = require('passport');
var Challenge = require('../models/challenge');
var Like = require('../models/like');
var Comment = require('../models/comment');
var mongoose = require('mongoose');
var Gaunlet = require('../models/gauntlet');
var GaunletStatus = require('../models/gauntletStatus');
var Notifications = require("../logic/notifications");
//Get this users' challenges
router.get('/self', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Challenge.find({})
        .where('issuer').equals(req.user._id)
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        })
});

//Get all challenges -- to be changed to show challenges of people the user follows (and maybe global ones)
router.get('/flow', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Challenge.find({})
    //.where('issuer').equals(req.user._id)
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        })
});

//Get all challenges -- to be changed to show challenges of people the user follows (and maybe global ones)
router.get('/comments/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Comment.find({'on.doc': req.params.id})
        .populate('user', 'username')
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        })
});

//Get all challenges -- to be changed to show challenges of people the user follows (and maybe global ones)
router.post('/comments/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    var com = new Comment({
        user: req.user,
        actual: req.body.comment
    });
    com.on.kind = "Challenge";
    com.on.doc = req.params.id;
    com.save(function (err, result) {
        if (err || !result) {
            res.status(500).send("Something went wrong");
        } else {
            res.status(200).send("Done!");
        }
    })
});

//Create a new challenge
router.post('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    new Challenge({
        title: req.body.name,
        desc: req.body.desc,
        type: req.body.type,
        issuer: req.user
    }).save(function (err, result) {
        if (err || !result) {
            res.status(500).send("Something went wrong");
        } else {
            res.status(200).send("Challenge Created");
        }
    })

});
//Create a new challenge
router.post('/gaunlet', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (req.body[0] === undefined)
        res.status(500).send("Error");
    var challengees = req.body[0], fail;
    for (var i = 0, j = req.body[0].length; i < j; i++) {
        new Gaunlet({
            challenger: req.user,
            challengee: challengees[i],
            challenge: req.body[1],
            status: new GaunletStatus()
        }).save(function (err,result) {
            //Should we stop?
            if (err)
                fail = 1;
            else {
                Notifications.sendNotification(result.challengee, "You have been challenged by: " + req.user.username +
                    " check your profile!")
            }
        });
    }

    res.status(200).send("Challenge Created");


});

//Get gaunlets in general
router.get('/gaunlet', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        });

});

//Get gaunlets thrown at me
router.get('/gaunlet/self', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .where('challengee').equals(req.user)
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        });

});
//Get gaunlets thrown at me
router.get('/gaunlet/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .where('challengee').equals(req.params.id)
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .exec(function (err, result) {
            if (err || !result) {
                res.status(500).send("Something went wrong");
            } else {
                res.status(200).send(result);
            }
        });

});

router.post('/like/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Like.findOne()
        .where('user').equals(req.user._id)
        .where('challenge').equals(req.params.id)
        .exec(function (err, result) {
            if (err) {
                res.status(500).json({error: err});
            } else if (result) {
                result.remove(function (err) {
                    if (err) {
                        res.status(500).json({error: err});
                    } else {
                        res.status(200).json({info: "success"});
                    }
                });
            } else {
                new Like({
                    challenge: req.params.id,
                    user: req.user._id
                }).save(function (err, result) {
                    if (err || !result) {
                        res.status(500).json({error: err});
                    } else {
                        res.status(200).json({info: "success"});
                    }
                });
            }

        });

});


router.post('/likes/user', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    var array = req.body.challenges;
    Like.find({}, 'challenge')
        .where('challenge').in(array)
        .where('user').equals(req.user._id)
        .exec(function (err, result) {
            if (err) {
                res.status(500).json({error: err});
            } else if (result) {
                res.status(200).json(result);
            }
        });

});


router.post('/likes/all', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    var array = [];
    for (var i = 0, j = req.body.challenges.length; i < j; i++) {
        array.push(mongoose.Types.ObjectId(req.body.challenges[i]));
    }

    Like.aggregate([
        {
            $match: {
                'challenge': {$in: array}
            }
        }, {
            $group: {
                _id: "$challenge",
                challenge: {$push: "$challenge"},
                likes: {$sum: 1}
            }
        }
    ], function (err, result) {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            res.status(200).json(result);
        }
    });

});

module.exports = router;