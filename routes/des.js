var express = require('express');
var router = express.Router();
var passport = require('passport');
var Challenge = require('../models/challenge');


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


module.exports = router;