var express = require('express');
var router = express.Router();
var path = require('path');
var Gaunlet = require('../models/gauntlet'),
    GaunletStatus = require('../models/gauntletStatus');
var client = require('../models/client');
//send the partial
router.get('/partial/:name', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public/partial/' + req.params.name));
});
router.get('/test', function (req, res, next) {
    new client({
        name: "web",
        clientId: "Axxh45u4bdajGDshjk21n",
        clientSecret: "d13e~223~!!@$5dasd"
    }).save(function (err, result) {
        if (err) {
            res.status(500).send();
        } else {
            res.status(200).send();
        }
    })
});
router.get('/format', function (req, res, next) {
    Gaunlet.find({})
        .populate('status')
        .exec()
        .then(function (result) {
            result.forEach(function (element) {
                if (!element.status || !element.status.status) {
                    element.status = new GaunletStatus();
                    element.status.save(function (err) {
                        if (err) {
                            console.log("error");
                        } else {
                            element.save(function (err) {
                                if (err) {
                                    console.log("error");
                                }
                            })
                        }
                    });
                }
            })
        });
    res.status(200).send();

});

//No matter what the request, always send the index page first
router.get('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = router;
