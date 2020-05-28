const dotenv = require('dotenv');
dotenv.config();
const mangoose = require('mongoose');
const url = process.env.DATABASE

mangoose.connect(url,{
    useNewUrlParser : true
})

.then(() => {
    console.log('SUCCEFULLY CONNECTED TO DATABASE'); 
})

.catch(err => {
    console.log('couldnot connected to database'+err);
    process.exit();  
});