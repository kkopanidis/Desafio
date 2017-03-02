const User = require('../models/user'),
    userInfo = require('../models/userInfo'),
    mongoose = require('mongoose'),
    gauntletStatus = require('../models/gauntletStatus'),
    gauntlet = require('../models/gauntlet'),
    Denchange = require('../models/denchange'),
    moment = require('moment'),
    notification = require('./notifications'),
    Promise = require('bluebird');

function complete(gauntletID) {
    let user_1;
    gauntlet.findById(gauntletID)
        .populate('status')
        .exec()
        .then(function (res) {
            res.status.status = "COMPLETED";
            res.status.save();
            return res.save();
        })
        .then(function (item) {
            return new Denchange({
                user: item.challengee,
                type: "INC",
                amount: 100
            }).save()
        })
        .then(function (item) {
            return User.findById(item.user)
                .populate('info')
                .exec();

        })
        .then(function (user) {
            if (user) {
                if (user.info.denarius) {
                    user.info.denarius += 100;
                } else {
                    user.info.denarius = 100;
                }
                user_1 = user;
                return user.info.save();

            } else {
                throw "Something went wrong"
            }
        })
        .then(function (info) {
            notification.sendNotification(user_1, "You have been " +
                "awarded 100 denarius, added to your total of " + info.denarius);
        })
        .catch(function (err) {
            console.log("Error: " + err);
        })
}

function fail(gauntletID) {
    let user_1;
    gauntlet.findById(gauntletID)
        .populate('status')
        .exec()
        .then(function (res) {
            res.status.status = "FAILED";
            return res.save();
        })
        .then(function (item) {
            return new Denchange({
                user: item.challengee,
                type: "DEC",
                amount: 100
            }).save()
        })
        .then(function (item) {
            return User.findById(item.user)
                .populate('info')
                .exec();

        })
        .then(function (user) {
            if (user) {
                if (user.info.denarius) {
                    user.info.denarius -= 100;
                } else {
                    user.info.denarius = -100;
                }
                return user.info.save();

            } else {
                throw "Something went wrong"
            }
        })
        .then(function (info) {
            notification.sendNotification(user_1, "100 denarius " +
                "have been removed, your new total is " + info.denarius);
        })
        .catch(function (err) {
            console.log("Error: " + err);
        })
}

//export the function
module.exports.fail = fail;
module.exports.success = complete;