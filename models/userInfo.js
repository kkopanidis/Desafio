var mongoose = require('mongoose'),

    Schema = mongoose.Schema,

    UserInfo = new Schema({
        firstname: {
            type: String
        },
        lastname: {
            type: String
        },
        desc: {
            type: String
        },
        denarius: {
            type: Number,
            Default: 0
        },
        photo: {
            type: String
        }
    });

module.exports = mongoose.model('UserInfo', UserInfo);