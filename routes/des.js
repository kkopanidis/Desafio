var express = require('express');
var router = express.Router();
var passport = require('passport');
var Challenge = require('../models/challenge');
var Like = require('../models/like');
var mongoose = require('mongoose');

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