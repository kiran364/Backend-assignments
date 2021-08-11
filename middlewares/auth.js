const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();                        // to use .env variables

module.exports = function (req, res, next) {
    // Get Token
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(400).json({msg: 'No token found'});
    }
    
    try {
        const decodetoken = jwt.verify(token, process.env.SecretKey);
        req.user = decodetoken.user;
        next();
    } catch (err) {
        res.status(500).json({msg: 'Token is invalid'});
        console.log(err);
    }
}