var mongoose = require('mongoose'),
    crypto = require('crypto'),
    valmail = require('../logic/utils/mailValidation'),
    Schema = mongoose.Schema,

    User = new Schema({
            email: {
                type: String,
                unique: true,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            dob: {
                type: Date,
                required: true
            },
            hashedPassword: {
                type: String,
                required: true
            },
            salt: {
                type: String,
                required: true
            },
            isConfirmed: {
                type: Boolean
            },
            info: {
                type: Schema.Types.ObjectId,
                ref: 'UserInfo'
            },
            notifications: [{
                type: Schema.Types.ObjectId,
                ref: 'Notification'
            }]
        },
        {
            timestamps: true
        });

User.pre('save', function (doc, next) {
    valmail(this.email, function (err) {

        if (err) {
            next(err);
        } else {
            doc();
        }
    })


});


User.methods.encryptPassword = function (password) {
    //Not secure, needs to change to sha256
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha1').toString('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });

User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', User);