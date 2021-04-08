const jwt = require('jsonwebtoken');

module.exports.userAuthenticator = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: 'User is not authenticated'
        });
    } else if (req.user && (req.user.exp < (new Date().getTime() / 1000))) {
        return res.status(401).json({
            message: 'User session expire'
        });
    } else {
        next()
    }
};