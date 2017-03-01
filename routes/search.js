const express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Challenge = require('../models/challenge'),
    User = require('../models/user');


//Search the platform
router.post('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {

    if (!req.body.hasOwnProperty("searchText")) {
        next();
        return;
    }

    let searched = [], doneAll = 0;

    Challenge.find({title: {$regex: req.body.searchText}})
        .exec()
        .then(function (result) {
            if (result) {
                if (result.length != 0) {
                    let i = 0, j = result.length;
                    for (; i < j; i++)
                        searched.push(result[i]);
                }

            }
            return User.find({username: {$regex: req.body.searchText}}).exec();
        })
        .then(function (result) {
            if (result) {
                if (result.length != 0) {
                    let i = 0, j = result.length
                    for (; i < j; i++)
                        searched.push(result[i]);
                }
            }
            res.status(200).send(searched);
        })
        .catch();
});

module.exports = router;