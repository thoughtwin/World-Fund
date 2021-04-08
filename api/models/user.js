const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },

    password: {
        type: String
    },

    image: {
        type: String,
        default: ''
    },

    userName: {
        type: String,
        default: ''
    },
    pinCode: {
        type: String,
    },
    static1: {
        type: String,
        default: ''
    },
    static2: {
        type: String,
        default: ''
    },
    static3: {
        type: String,
        default: ''
    },
    static4: {
        type: String,
        default: ''
    },
    static5: {
        type: String,
        default: ''
    },
    static6: {
        type: String,
        default: ''
    },
    invitedBy: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    },
},
    {
        timestamps: true
    });


UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            // console.log('user =' +user)
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                // console.log('hash =' +hash)
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, pwd, cb) {

    bcrypt.compare(passw, this.password, function (err, isMatch) {
        //console.log('err = ' + err)

        if (err) {
            return err;
        }
        // console.log('isMatch = ' + isMatch)
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);