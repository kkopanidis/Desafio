var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    //Demo implementation
    //Probably should be more intelligent than this
    Notification = new Schema({
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            read: {
                type: Boolean,
                Default: false
            }
        },
        {
            timestamps: true
        }
    )
    ;


module.exports = mongoose.model('Notification', Notification);