const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require('morgan');
const helmet = require("helmet");
const cors = require("cors");

const todoRoute = require('./routes/todo');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');



// App Config...
const app = express();                  // instanciating express() in app variable
dotenv.config();                        // to use .env variables
const Port = process.env.Port;


// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use("/todos", todoRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);


// DB Config
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then ( () => console.log("MongoDB Connected"))
.catch ( (err) => console.log(err));


//Default Route
app.get("/", (req, res) => {
    res.send("Hello From Server All Ok.........");
});


//Port for listening
app.listen(Port, () => {
    console.log(`Server Running On Port ${Port}`);
})
