const mongoose = require('mongoose');
      mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// Email Validations

    let emailLengthChecker = (email) => {
        if (!email) { return false; }
        if (email.length < 5 || email.length > 30){
            return false;
        } else {
            return true;
        }
    };

    let validEmail = (email) => {
        if (!email) { return false; }
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,:;\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        console.log('Valid Email Regex: ' + regExp.test(email));
        return regExp.test(email);
    };

    const emailValidators = [
        {
            validator: emailLengthChecker,
            message: 'E-mail must be at least 5 characters long but no more than 30'
        },
        {
            validator: validEmail,
            message: 'Must be a valid E-mail'
        }
    ];

// Username Validations

    let usernameLengthChecker = (username) => {
        if (!username) { return false; }
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    };

    let validUsername = (username) => {
        if (!username) { return false; }
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        console.log('Valid username regex: ' + regExp.test(username));
        return regExp.test(username);
    };

    const usernameValidators = [
        {
            validator: usernameLengthChecker,
            message: 'Username must be at least 3 characters long and less than 15 characters in length'
        },
        {
            validator: validUsername,
            message: 'Invalid username, username must not contain any special characters'
        }
    ];

// Password Validations

    let passwordLengthChecker = (password) => {
        if (!password) { return false; }
        if (password.length < 9 || password.length > 35) {
            return false;
        } else {
            return true;
        }
    };

    let validPassword = (password) => {
        if (!password) { return false; }
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        console.log('Valid pw regex: ' + regExp.test(password));
        return regExp.test(password);
    };

    const passwordValidators = [
        {
            validator: passwordLengthChecker,
            message: 'Password must be at least 9 characters long and less than 35 characters in length'
        },
        {
            validator: validPassword,
            message: "Must contain at least: 1 uppercase, lowercase, special character, and number"
        }
    ];

// SCHEMA
    const userSchema = new Schema(
        {
            email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
            username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
            password: { type: String, required: true, validate: passwordValidators}
        }
    );
         userSchema.pre('save', function (next) {
             if (!this.isModified('password')) return next();
            bcrypt.hash(this.password, null, null, (err,hash) => {
                if (err) return next (err);
                this.password = hash;
                next();
            });
         });

// Login Methods

    userSchema.methods.comparePassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

// EXPORT SCHEMA FOR USAGE

    module.exports = mongoose.model('User', userSchema);
