var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Denchange = new Schema({
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            type: {
                type: String,
                enum: ['DEC', 'INC'],
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        },
        {
            timestamps: true
        }
    )
    ;


module.exports = mongoose.model('Denchange', Denchange);