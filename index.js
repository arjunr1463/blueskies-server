const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const dbconnect = require("./config/dbConnect");
const app = express();
const authRoute = require("./routes/authRoute");
const cors = require("cors");
const compression = require('compression')

//Middlewares
app.use(cors());
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({limit:'100mb', extended: true }));
app.use(compression())
app.use("/api", authRoute);

//MongoDB
dbconnect();

//PORT
PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
