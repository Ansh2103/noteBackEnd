const mangoose = require('mongoose');
const userSchema = mangoose.Schema({
    name: String,
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    password: String,
},{
    timestamps:true
})

module.exports=mangoose.model('User',userSchema)