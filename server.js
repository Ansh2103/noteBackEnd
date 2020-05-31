const express = require('express');
const bodyParser = require('body-parser');

var dotenv = require('dotenv')
dotenv.config();

const port = process.env.PORT
const app = express();

const database = require('./config/config.database')
var userRoute= require('./app/routes/user.routes')
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())
app.use('/user',userRoute)
database.mangoose;
// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port  "+port)
});