var mongoose = require('mongoose');

//todo add database url here
mongoose.connect('mongodb://83.212.101.8/desafio');

mongoose.Promise = require('bluebird');

var db = mongoose.connection;

db.on('error', function (err) {
    console.error('Connection error:', err.message);
});

db.once('open', function callback() {
    console.info("Connected to DB!");
});

module.exports = mongoose;