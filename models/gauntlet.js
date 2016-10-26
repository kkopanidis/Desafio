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
            }, challengee: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }, challenge: {
                type: Schema.Types.ObjectId,
                ref: 'Challenge',
                required: true
            }, status: {
                stat: ['ACCEPTED', 'REJECTED', 'PENDING'],
                default: 'PENDING'
            }
        },
        {
            timestamps: true
        });

module.exports = mongoose.model('Gauntlet', Gauntlet);