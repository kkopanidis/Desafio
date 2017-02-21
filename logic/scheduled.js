"use strict";

var mongoose = require('mongoose'),
    gaunletStatus = require('../models/gauntletStatus'),
    gaunlet = require('../models/gauntlet'),
    moment = require('moment'),
    notifications = require("../logic/notifications");

//sync gauntlet state
function gaunletSync() {

    gaunlet.find({})
        .populate('status')
        .exec(function (err, result) {
            result.forEach(function (element) {
                //if the gauntlet has been accepted
                if (element.status && element.status.status === "ACCEPTED") {
                    var date = new Date(moment().utc().format());
                    //if the deadline has passed then the gauntlet has failed
                    if (date > element.deadline) {
                        element.status.status = "FAILED";
                        element.save(function (err) {
                            if (err) {
                                console.log("failed to update gauntlet");
                            }
                            else {
                                notifications.sendNotification(element.challengee,
                                    "You failed to complete challenge with id: " + element.challenge);
                            }
                        })
                    }
                }
            });
        });

}

module.exports.gaunlets = gaunletSync;


