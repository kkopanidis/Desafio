var express = require('express');
var router = express.Router();
var oauth2 = require('../auth/oauth2');

//Authentication
router.post('/token', oauth2.token);

module.exports = router;