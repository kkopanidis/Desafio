const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Challenge = require('../models/challenge'),
    Like = require('../models/like'),
    Comment = require('../models/comment'),
    mongoose = require('mongoose'),
    Gaunlet = require('../models/gauntlet'),
    GaunletStatus = require('../models/gauntletStatus'),
    User = require('../models/user'),
    Notifications = require("../logic/notifications"),
    Promise = require('bluebird');

//Get this users' challenges
router.get('/self', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Challenge.find({})
        .where('issuer').equals(req.user._id)
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Nothing found";
            } else {
                res.status(200).send(result);
            }
        })
        .catch(next)
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
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Nothing found";
            } else {
                res.status(200).send(result);
            }
        })
        .catch(next);
});

//Get all challenges -- to be changed to show challenges of people the user follows (and maybe global ones)
router.post('/comments/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    const com = new Comment({
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
    const challengees = req.body[0];
    let fail;
    for (let i = 0, j = req.body[0].length; i < j; i++) {
        new GaunletStatus()
            .save()
            .then(function (status) {
                return new Gaunlet({
                    challenger: req.user,
                    challengee: challengees[i],
                    challenge: req.body[1],
                    status: status
                }).save();
            })
            .then(function (item) {
                Notifications.sendNotification(result.challengee,
                    "You have been challenged by: " + req.user.username + " check your profile!")
            })
            .catch(function (err) {
                //what do we do on error?
                //do we stop?
            })

    }

    res.status(200).send("Challenge Created");


});


//Complete gauntlet
router.post('/gaunlet/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    let action = req.body.action;
    Gaunlet.findById(req.params.id)
        .where('challengee').eq(req.user)
        .populate('status')
        .exec()
        .then(function (result) {
            if (result) {
                switch (action) {
                    case 'accept':
                        if (result.status.status === 'PENDING') {
                            result.status.status = 'ACCEPTED';
                            return result.status.save();
                        } else {
                            throw "Something went wrong";
                        }
                        break;
                    case 'reject':
                        if (result.status.status === 'PENDING') {

                            result.status.status = 'REJECTED';
                            return result.status.save();
                        } else {
                            throw "Something went wrong";
                        }
                        break;
                    case 'complete':
                        if (result.status.status === 'ACCEPTED') {
                            result.status.status = 'REVIEW';
                            return result.status.save();
                        } else {
                            throw "Something went wrong";
                        }
                        break;
                }
            } else {
                throw "Something went wrong";
            }
        })
        .then(function (result) {
            res.status(200).send("OK");

        })
        .catch(next);
});

//Get gaunlets in general
router.get('/gaunlet', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .populate('status')
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Nothing found";
            } else {
                res.status(200).send(result);
            }
        })
        .catch(next);

});

//Get gaunlets thrown at me
router.get('/gaunlet/self', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .where('challengee').equals(req.user)
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .populate('status')
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
        .exec()
        .then(function (result) {
            if (result) {
                return result.remove(function (err) {

                });
            } else {
                return new Like({
                    challenge: req.params.id,
                    user: req.user._id
                }).save();
            }
        })
        .then(function (item) {
            res.status(200).json({info: "success"});
        })
        .catch(next);

});


router.post('/likes/user', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    const array = req.body.challenges;
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

    const array = [];
    let i = 0;
    const j = req.body.challenges.length;
    for (; i < j; i++) {
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