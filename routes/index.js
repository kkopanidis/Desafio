var express = require('express');
var router = express.Router();
var path = require('path');

//send the partial
router.get('/partial/:name', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public/partial/' + req.params.name));
});

//No matter what the request, always send the index page first
router.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = router;
