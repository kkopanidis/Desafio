var mongoose = require('mongoose'),

    Schema = mongoose.Schema,

    GauntletStatus = new Schema({
            status: {
                type: String,
                enum: ['ACCEPTED', 'REJECTED', 'COMPLETED', 'FAILED', 'PENDING'],
                default: 'PENDING'
            },
            acc_rej_Date: { //date the challengee accepted or rejected the challenge
                type: Date
            },
            completed_Date: {
                type: Date
            }
        },
        {
            timestamps: true
        });

module.exports = mongoose.model('GauntletStatus', GauntletStatus);