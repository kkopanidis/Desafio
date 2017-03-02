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

//You cannot follow yourself
Connection.pre('save', function (doc, next) {
    if (this.follower === this.followee) {
        next();
    } else {
        doc();
    }
});

module.exports = mongoose.model('Connection', Connection);