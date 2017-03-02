/**
 * This model represents the relationship among users and challenges
 */

var mongoose = require('mongoose'),

    Schema = mongoose.Schema,

    Gauntlet = new Schema({
            challenger: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            challengee: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            challenge: {
                type: Schema.Types.ObjectId,
                ref: 'Challenge',
                required: true
            },
            deadline: {
                type: Date
            },
            proof: {
                type: Buffer
            },
            status: {
                type: Schema.Types.ObjectId,
                ref: 'GauntletStatus'
            }
        },
        {
            timestamps: true
        });


//You cannot challenge yourself
Gauntlet.pre('save', function (doc, next) {
    if (this.challenger === this.challengee) {
        next();
    } else {
        doc();
    }
});

//A challenger cannot challenge another challengee more than once on the same challenge
Gauntlet.index({challenger: 1, chalengee: 1, challenge: 1}, {unique: true});
module.exports = mongoose.model('Gauntlet', Gauntlet);