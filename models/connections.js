var mongoose = require('mongoose'),

    Schema = mongoose.Schema,

    Connection = new Schema({
            follower: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            followee: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        },
        {
            timestamps: true
        });

module.exports = mongoose.model('Connection', Connection);