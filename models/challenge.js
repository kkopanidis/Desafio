var mongoose = require('mongoose'),

    Schema = mongoose.Schema,

    Challenge = new Schema({
            title: {
                type: String,
                required: true
            },
            desc: {
                type: String,
                required: true
            },
            type: {
                type: String
            },
            issuer: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true

            }
        },
        {
            timestamps: true
        });

module.exports = mongoose.model('Challenge', Challenge);