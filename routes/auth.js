const router = require('express').Router();
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const dotenv = require("dotenv");
dotenv.config();                        // to use .env variables

const User = require("../models/userModel");

// Private Route, logged In User Can Access it.
router.get("/", auth, async(req, res) => {
    try {
        // find user and show data but hide password
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    } catch (err) {
        res.status(500).json({err});
        console.log(err);
    }
})

router.post("/",[
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter valid password').exists()
], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({msg: 'User not found with provided email'});
        }
        const checkpassword = await bcrypt.compare(password, user.password);
        if(!checkpassword) {
            res.status(400).json({msg: "Password invalid"});
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, process.env.SecretKey, {
            // expiresIn:360000
        },(err, token) => {
            if(err) throw err;
            res.json({token})
        })

    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})

module.exports = router;