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
    GauntletUtil = require("../logic/gauntlets"),
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
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Nothing found";
            } else {
                res.status(200).send(result);
            }
        }).catch(next);
});

//Get all challenges -- to be changed to show challenges of people the user follows (and maybe global ones)
router.get('/comments/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (req.params.id === "" || req.params.id < 10) {
        next();
        return;
    }
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


//Get gaunlets in general
router.get('/gauntlet', passport.authenticate('bearer', {session: false}), function (req, res, next) {

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
router.get('/gauntlet/self', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .where('challengee').equals(req.user)
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .populate('status')
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Something went wrong";
            } else {
                res.status(200).send(result);
            }
        })
        .catch(next);

});
//Get gaunlets pending review
router.get('/gauntlet/review', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    Gaunlet.find({})
        .where('challenger').equals(req.user)
        .populate('challenge', 'title')
        .populate('challenger', 'username')
        .populate('challengee', 'username')
        .populate('status', null, {status: {$eq: "REVIEW"}})
        .exec()
        .then(function (err, result) {
            if (!result) {
                throw "Something went wrong";
            } else {

                let send = [];
                let i = 0, j = result.length;
                for (; i < j; i++) {
                    if ((result[i].status == undefined || result[i].status.status == undefined) ||
                        result[i].status.status != "REVIEW") {

                        continue;
                    }
                    result[i]._doc.decodedProof = result[i].proof.toString('base64');
                    send.push(result[i]);
                }
                res.status(200).send(send);
            }
        })
        .catch(next);

});


// Post a new comment
router.post('/comments/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (!req.body.comment) {
        next();
        return;
    }
    else if (req.params.id === "" || req.params.id < 11) {
        next();
        return;
    }

    new Comment({
        user: req.user,
        actual: req.body.comment,
        on: {
            kind: "Challenge",
            doc: req.params.id
        }
    }).save(function (err) {
        if (err) {
            res.status(500).send("Something went wrong");
        } else {
            res.status(200).send("Done!");
        }
    })
});

//Create a new challenge
router.post('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (!req.body.hasOwnProperty("title") || !req.body.hasOwnProperty("desc") || !req.body.hasOwnProperty("type")) {
        next();
        return;
    }

    new Challenge({
        title: req.body.title,
        desc: req.body.desc,
        type: req.body.type,
        issuer: req.user
    }).save(function (err) {
        if (err) {
            res.status(500).send("Something went wrong");
        } else {
            res.status(200).send("Challenge Created");
        }
    })

});

//Create a new gauntlet
router.post('/gauntlet', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    if (!(req.body instanceof Array) || !(req.body[0] instanceof Array)) {
        next();
        return;
    }

    const challengees = req.body[0];
    let i = 0, j = req.body[0].length;
    for (; i < j; i++) {
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
                Notifications.sendNotification(item.challengee,
                    "You have been challenged by: " + req.user.username + " check your profile!")
            })
            .catch(function (err) {
                Notifications.sendNotification(req.user._id,
                    "The challenge you sent to " + challengees[i] + "failed to be sent, please try again")
            })
    }

    res.status(200).send("Challenge Created");

});


//Complete gauntlet
router.post('/gauntlet/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (req.params.id === "" ||
        req.params.id < 11 || !req.body.hasOwnProperty("action")) {
        next();
        return;
    }

    let action = req.body.action;
    Gaunlet.findById(req.params.id)
        .populate('status')
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Something went wrong";
            }
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
                        result.proof = new Buffer(req.body.proof, "Base64");
                        result.status.save();
                        return result.save();
                    } else {
                        throw "Something went wrong";
                    }
                    break;
                case 'revaccept':
                    if (result.status.status === 'REVIEW' &&
                        mongoose.Types.ObjectId(result.challenger).toString()
                        === mongoose.Types.ObjectId(req.user._id).toString()) {
                        GauntletUtil.success(result._id);
                    } else {
                        throw "Something went wrong";
                    }
                    break;
                case 'revreject':
                    if (result.status.status === 'REVIEW' && result.challenger === req.user._id) {
                        GauntletUtil.fail(result._id);
                    } else {
                        throw "Something went wrong";
                    }
                    break;
                default:
                    throw "Something went wrong";
                    break; // Unnecessary
            }

        })
        .then(function (result) {
            res.status(200).send("OK");
        })
        .catch(next);
});

router.post('/like/:id', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (req.params.id === "" ||
        req.params.id < 11) {
        next();
        return;
    }
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
    if (!req.body.hasOwnProperty("challenges")) {
        next();
        return;
    }
    const array = req.body.challenges;
    Like.find({}, 'challenge')
        .where('challenge').in(array)
        .where('user').equals(req.user._id)
        .exec()
        .then(function (result) {
            if (!result) {
                throw "Something went wrong";
            } else if (result) {
                res.status(200).json(result);
            }
        })
        .catch(next);

});


router.post('/likes/all', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    if (!req.body.hasOwnProperty("challenges") || !(req.body.challenges instanceof Array)) {
        next();
        return;
    }
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