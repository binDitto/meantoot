const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');



module.exports = (router) => {

// REGISTER
    router.post('/register', (req, res) => {
        // req.body.email;
        // req.body.username;
        // req.body.password;
        if (!req.body.email) {
            console.log(req.body);
            console.log('No email provided');
            return res.json({ success: false, msg: 'You must provide an email' });
        }

        if (!req.body.username) {
            console.log(req.body);
            console.log('No username provided');
            return res.json({ success: false, msg: 'You must provide a username' });
        }

        if (!req.body.password) {
            console.log(req.body);
            console.log('No password provided');
            return res.json({ success: false, msg: 'You must provide a password' });
        }

        // All fields provided - create new user and save to database
        let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
        });

            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        console.log(err.code);
                        console.log('Error: Username or email already exists' );
                        return res.json({ success: false, message: 'Username or email already exists' });
                    }
                    if (err.errors) {
                        console.log(err.errors);
                        if (err.errors.email) {
                            console.log(err.errors.email.message);
                            return res.json({ success: false, message: err.errors.email.message });
                        }
                        if (err.errors.username) {
                            console.log(err.errors.username.message);
                            return res.json({ success: false, message: err.errors.username.message });
                        }
                        if (err.errors.password) {
                            console.log(err.errors.password.message);
                            return res.json({ success: false, message: err.errors.password.message});
                        }
                        return res.json({ success: false, message: err});
                    }
                    console.log('Error: Cannot save user: ' + err.errmsg);
                    return res.json({ success: false, message: 'Could not save user. Error: ', err });
                }

                // No errors found
                console.log('Success!');
                res.json({success: true, message: 'Account Registered.' });
            });
    });

// EMAIL CHECK
    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            return res.json({ success: false, message: 'Email was not provided' });
        }

        // Email was provided
        User.findOne({ email: req.params.email }, ( err, user ) => {
            if ( err ) {
                return res.json({ success: false, message: err });
            }
            if ( user) {
                return res.json({ success: false, message: 'Email is already taken' });
            }

            // No errors, and no one in database is using the email
            return res.json({ success: true, message: 'Email is available!' });
        });
    });

// USERNAME CHECK
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            return res.json({ success: false, message: 'Username was not provided' });
        }

        // Username was provided
        User.findOne({ username: req.params.username }, ( err, user ) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, message: err });
            }
            if ( user ) {
                return res.json({ success: false, message: 'Username taken' });
            }
            // No errors, and no user found with username
            return res.json({ success: true, message: 'Username available' });
        });
    });

// LOGIN
    router.post('/login', (req, res) => {
        // res.send('test');
        if (!req.body.username) {
            return res.json({ success: false, message: 'No username was provided' });
        }

        if (!req.body.password) {
            return res.json({ success: false, message: 'No password was provided' });
        }

        // Fields provided
        User.findOne({ username: req.body.username.toLowerCase() }, ( err, user ) => {
            if (err) { return res.json({ success: false, message: err });};
            if (!user) { return res.json({ success: false, message: 'Username or Password does not exist. '});};
            // User found - test/compare passwords
            const validPassword = user.comparePassword(req.body.password);
            if (!validPassword) {
                return res.json({ success: false, message: 'Password or Username does not exist.'});
            }
            // Fields entered matched database user
            // Create a web token for user to use for logging in - will logout after 24hours
            const token = jwt.sign({userId: user._id}, config.secret, { expiresIn: '24h' });
            // send success message along with filtered data to send back ( no password etc )
            return res.json({ success: true, message: 'Success', token: token, user: { username: user.username}});
        });
    });

// HEADER & TOKEN MIDDLEWARE
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.json({ success: false, message: 'No token provided'});
        }

        jwt.verify(token, config.secret, ( err, decoded ) => {
            if (err) { return res.json({ success: false, message: 'Token invalid: ' + err});};
            // Set req.decoded to be decoded token(user) for use by other endpoints
            req.decoded = decoded;
            next();
        });
    });

// PROFILE - get user info
    router.get('/profile', (req, res) => {
        // res.send('test');
        // res.send(req.decoded);

        // GET USER PROFILE WITH TOKEN PROVIDED THROUGH REQ.DECODED
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if (err) { return res.json({ success: false, message: err }); }
            if (!user) { return res.json({ success: false, message: 'User not found'}); }

            return res.json({ success: true, user: user });
        });
    });
// PUBLIC PROFILE
    router.get('/publicProfile', (req, res) => {
        if (!req.params.username) {
            return res.json({ success: false, message: 'No username was provided'});
        }
        User.findOne({ username: req.params.username }, ( err, user) => {
            if ( err) {
                return res.json({ success: false, message: 'Something went wrong.' });
            }
            if (!user) {
                return res.json({ success: false, message: 'Username not found.'});
            }
            return res.json({ success: true, user: user });
        });
    });
    return router;
};
