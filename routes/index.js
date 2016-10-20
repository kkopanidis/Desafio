var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/partial/:name', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public/partial/' + req.params.name));
});

router.get('/*', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


module.exports = router;
