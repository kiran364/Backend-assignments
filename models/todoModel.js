const mongoose = require('mongoose');
const validator = require('validator');
const {Schema} = require("mongoose");


const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    name: {
        type: String,
        require: true,
    },
    todotitle: {
        type: String,
    },
    status: {
        type: String,
    },
    category:{
        type: String
    }
},
   {timestamps: true});

module.exports = mongoose.model('Todo', todoSchema);