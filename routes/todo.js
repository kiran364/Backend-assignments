const router = require('express').Router();
const mongoose = require('mongoose');
const {check, validationResult} = require("express-validator/check");
const auth = require("../middlewares/auth");

const User = require("../models/userModel");
const Todo = require('../models/todoModel');


router.post('/', [auth,
    check('name', 'name is required').not().isEmpty(),
    check('todotitle', 'Please enter todotitle email').not().isEmpty(),
    check('status', 'Please enter status completed or not completed').not().isEmpty(),
    check('category', 'Enter category ex. hobby, work and task').not().isEmpty()
        ], async (req, res) =>{
            const errors = validationResult(req);
                if(!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()})
                }

            try {
                const {name, todotitle, status, category} = req.body;
                const newtodo = new Todo({
                    name,
                    todotitle,
                    status, 
                    category,
                    user: req.user.id
                });
                const savetodo = await newtodo.save();
                res.status(200).json(savetodo)

            } catch (err) {
                console.log(err);
                res.status(500).json({err});
            }
})

router.patch('/', auth,  async (req, res) => {
    const {name, status, todotitle, category} = req.body;
    const userExist = await Todo.findOne({name:name})
    if(userExist) {
        const key = userExist._id;
        const updateuser = new Todo({status, category});
        Todo.findByIdAndUpdate(key, {status: req.body.status, todotitle: req.body.todotitle, category: req.body.category}).then(() => {
            res.status(200).json({message: "Todo updated.."})
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const data = await Todo.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
  });

router.get("/",auth , async (req, res, next) => {
    try {
        // sorting data using createdAT field in descending order
        const data = await Todo.find().sort({createdAt: '-1'});
        // console.log(data);
        const filters = req.query;
        const filteredCategory = data.filter(category => {
            let isValid = true;
            for (key in filters) {
                console.log(key, category[key], filters[key]);
                isValid = isValid && category[key] == filters[key];
            }
            return isValid;
        })
        res.send(filteredCategory);
    } catch (err) {
        res.json.status(500).json(err);
        console.log(err);
    }
});


router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No Todo with id: ${id}`);
  
    await Todo.findByIdAndRemove(id);
  
    res.json({ message: "Todo deleted successfully." });
  });



module.exports = router;