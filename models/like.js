var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Like = new Schema({
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            challenge: {
                type: Schema.Types.ObjectId,
                ref: 'Challenge',
                required: true
            }
        },
        {
            timestamps: true
        });

Like.index({user: 1, challenge: 1}, {unique: true});

module.exports = mongoose.model('Like', Like);