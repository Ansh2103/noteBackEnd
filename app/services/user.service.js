var crypto = require('crypto');
var nodemailer = require('nodemailer');
var User = require('../models/user.model');
var bcrypt=require('bcrypt-nodejs');
var eventEmitter =require('../../events/event')
var Token = require('../models/token.model')

/**
 * get users details with respective email id
 * besically we check here whether the email is unique or not
 */

exports.signUp=async function(req,res){
    var userExist= await User.findOne({
        email:req.body.email
    })
/**
 * if user already exist it responds that user already exist
 */
    if(userExist){
        res.send({
            message:'user already exist'
        })
    }
    /**
     * craeting the objet of User model and assign the value which will be
     * recieve from user
     */
    let user = new User({
        name : req.body.name,
        email:req.body.email,
        password : req.body.password
    })
    /**
     * encrypt the plain text password and stored in database
     */

    await bcrypt.hash(req.body.password,bcrypt.genSaltSync(10),null,async function(err,hash){
        if(err)
        {
            throw err
        }
        else{
            user.password=hash
        }
/**
 * creating a record in database using mangoose create method
 */
        let userResponse=await User.create(user)
/**
 * creating an object of token model and assigning the userId which we get after creating record
 * of user in database and crating token by crypto method
 */
        var token=await new Token({
            _userId:userResponse._id,
            token:crypto.randomBytes(16).toString('hex')
        })
        /**
         * creating the record in database 
         * if it is successfull event is triggered to send the email
         */
        await token.save( function(err){
            if(err){
                return res.status(500).send({
                    message:err.message
                })

                }
                else{
                    let subject ='account verification token'
                    text=token.token
                    eventEmitter.emit('sendEmail',subject,user,text)
                }
        })
        res.send({
            status:userResponse.name+ 'resgistered'
        })
    })
}

exports.confirmAccount= async function(req,res){
   var tokenData = await Token.findOne({token:req.params.token})
   if (!tokenData) {
       return res.send({
           message:"Invalid token passed"
       })
   }
   var userData = await User.findOne({
       _id:tokenData._userId
   })
   if (!userData) {
       return res.status(401).send({
           message:'user doesnot exist, may be account is deleted'
       })
   }
   if (userData.isVerified) {
       return res.send({
           message : 'user is already verified'
       })
   }
    userData.isVerified = true
    userData.save(function(err){
        if(err){
            return res.status(500).send({
                message : err.message
            })
        }
        else{
            return res.status(200).send({
                message :'account has beeen verified'
            })
        }
    })
    
}
exports.login = async function(req,res){
    try{
        var userExists = await User.findOne({
            email:req.body.email
        })
        if(userExists){
            if(bcrypt.compareSync(req.body.password,userExists.password)){
                if(!userExists.isVerified){
                    return res.status(400).send({
                        message : 'User is not verified'
                    })
                }
                const payload = {
                    _id : userExists._id,
                    email: userExists.email,
                    name : userExists.name
                }

                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                    expiresIn:11140
                })
                res.send(token)
            }
            else{
                return res.status(401).send({
                    message:'Invalid password'
                })
            }
        }
        else{
            res.status(401).send({
                message : 'Invalid user address please check'
            })
        }
    }
    catch(error){
        throw error
    }
    
}
//forget Password
exports.forgetPassword = async function(req,res){
    var userExist = await User.findOne({
        email: req.body.email        
    })
    if(!userExist){
        return res.status(401).send({
            message:'User does not exists, may be account is deleted'
        })
    }   
    
    var token = await new Token({
        _userId: userExist._id,
        token: crypto.randomBytes(16).toString('hex')
    })

    await token.save( function(err){
        if(err){
            return res.status(500).send({
                message: err.message
            })
        }
        else{
            let subject = 'account verification token'
            let text = token.token
            eventEmitter.emit('sendEmail',subject,userExist,text)
            
        }
    })
    res.send({
        status: userExist.email+' token is send'
    })           
}



//update the password

 exports.updatePassword = async function(req,res){
     var userToken = await Token.findOne({
         token:req.params.token
        })
        if(userToken){
            var user = await User.findOne({
                _id:userToken._userId
            })
            if(user){
                await bcrypt.hash(req.body.password,bcrypt.genSaltSync(10),null,async function(err,hash){
                    if(err){
                        throw err
                    }
                    else{
                        user.password = hash
                    }
                })
                user.save(function(err) {
                    if(err){
                        return res.status(500).send({
                            message:'Something went wrong.'
                        })
                    }
                    else{
                        return res.status(200).send({
                            message:'Password updated successfully.'
                        })
                    }
                })

            }
            else{
                return res.status(401).send({
                    message:'User does not exists.'
                })
            }
        }
 }