var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    Comment = new Schema({
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            on: {
                kind: String,
                doc: {
                    type: Schema.Types.ObjectId,
                    refPath: 'on.kind'
                }
            },
            actual: {
                type: String,
                required: true
            }
        },
        {
            timestamps: true
        });

module.exports = mongoose.model('Comment', Comment);