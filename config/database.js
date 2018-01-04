const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    // uri: 'mongodb://localhost:27017/meantoot', 
    uri: "mongodb://binditto:Oitroi123@ds241677.mlab.com:41677/meantoot", // production 
    secret: crypto,
    db: 'meantoot'
}