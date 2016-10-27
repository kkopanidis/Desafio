var express = require('express');
var router = express.Router();
var passport = require('passport');
var Challenge = require('../models/challenge');
var User = require('../models/user');


//Create a new challenge
router.post('/', passport.authenticate('bearer', {session: false}), function (req, res, next) {
    var searched = [], doneAll = 0;

    function done() {
        if (doneAll === 2) {
            res.status(200).send(searched);
        }
    }

    Challenge.find({title: {$regex: req.body.searchText}})
        .exec(function (err, result) {

            if (!err && result) {
                if (result.length != 0) {
                    for(var i=0,j=result.length;i<j;i++)
                        searched.push(result[i]);
                }
                doneAll++;
                done();
            }
        });
    User.find({username: {$regex: req.body.searchText}})
        .exec(function (err, result) {
            if (!err && result) {
                if (result.length != 0) {
                    for(var i=0,j=result.length;i<j;i++)
                        searched.push(result[i]);
                }
                doneAll++;
                done();
            }
        });


});

module.exports = router;