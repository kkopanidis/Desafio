const express = require('express'),
    router = express.Router(),
    path = require('path'),
    client = require('../models/client');


//send the partial
router.get('/partial/:name', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'public/partial/' + req.params.name));
});
router.get('/init', function (req, res, next) {
    next();
    new client({
        name: "web",
        clientId: "Axxh45u4bdajGDshjk21n",
        clientSecret: "d13e~223~!!@$5dasd"
    }).save();
});

//No matter what the request, always send the index page first
router.get('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = router;
