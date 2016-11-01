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
        birthdate: {
            type: Date
        },
        denarius: {
            type: Number
        }
    });

module.exports = mongoose.model('UserInfo', UserInfo);