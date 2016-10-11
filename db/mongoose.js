var mongoose = require('mongoose');

mongoose.connect('mongodb://root:admin@storydb.westeurope.cloudapp.azure.com/studeat');

var db = mongoose.connection;

db.on('error', function (err) {
    console.error('Connection error:', err.message);
});

db.once('open', function callback () {
    console.info("Connected to DB!");
});

module.exports = mongoose;