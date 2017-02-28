"use strict";

var mongoose = require('mongoose'),
    gaunletStatus = require('../models/gauntletStatus'),
    gaunlet = require('../models/gauntlet'),
    moment = require('moment'),
    gauntlets = require("../logic/gauntlets");

//sync gauntlet state
function gaunletSync() {

    gaunlet.find({})
        .populate('status')
        .exec(function (err, result) {
            if(!result)
                return;
            result.forEach(function (element) {
                //if the gauntlet has been accepted
                if (element.status && element.status.status === "ACCEPTED") {
                    var date = new Date(moment().utc().format());
                    //if the deadline has passed then the gauntlet has failed
                    if (date > element.deadline) {
                        gauntlets.fail(element._id);
                    }
                }
            });
        });

}

module.exports.gaunlets = gaunletSync;


