const router = require('express').Router();
const mongoose = require('mongoose');
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();                        // to use .env variables

const User = require("../models/userModel");

//registration user route
router.post("/", [
    check('Username', 'Username is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter password with min 6 or more characters').isLength({
        min: 6}),
    check('phone', 'Enter Valid Mob no').isLength({min: 10})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const {Username, email, password, phone, role} = req.body;
    try {
        // if user already exist
        var user = await User.findOne({email});
        if(user) {
            return res.status(400).json({ msg: 'User already exists with provided email'});
        }
        // if new user
        user = new User({
            Username,
            email,
            password,
            phone,
            role
        })
        // password converting into hashed format
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        // res.status(200).json({user});
        
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
        // console.log(err);
    }
});

module.exports = router;