"use strict";

var mongoose = require('mongoose'),
    gauntletStatus = require('../models/gauntletStatus'),
    gauntlet = require('../models/gauntlet'),
    moment = require('moment'),
    gauntlets = require("../logic/gauntlets");

//sync gauntlet state
function gaunletSync() {

    gauntlet.find({})
        .populate('status')
        .exec()
        .then(function (result) {
            if (!result)
                throw "Something went wrong";
            result.forEach(function (element) {
                //if the gauntlet has been accepted
                if (element.status && element.status.status === "ACCEPTED") {
                    let date = new Date(moment().utc().format());
                    //if the deadline has passed then the gauntlet has failed
                    if (date > element.deadline) {
                        gauntlets.fail(element._id);
                    }
                }
            });
        })
        .catch(function (err) {
            console.log(err);
        });

}

module.exports.gaunlets = gaunletSync;


