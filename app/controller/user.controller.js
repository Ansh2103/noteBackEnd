var userService = require('../services/user.service')
exports.createUser = function(req,res){

    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });
   
    // Check for validation errors    
    var errors = req.validationErrors();
    if (errors) { return res.status(400).send(errors);} 
        else{
            userService.signUp(req,res)
        }
    }

    exports.confirmAccount = function(req,res){
        userService.confirmAccount(req,res);
    }
    
    exports.login = function(req,res){
        req.assert('email', 'Email is not valid').isEmail();
        req.assert('email', 'Email cannot be blank').notEmpty();
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        req.sanitize('email').normalizeEmail({ remove_dots: false });
        var errors = req.validationErrors();
            if (errors) { 
                return res.status(400).send(errors);
             }
             else{
                 userService.login(req,res)
             } 
    }
    
    exports.forgetPassword = function(req,res){
        req.assert('email','Email is not valid').isEmail();
        req.assert('email','Email cannot be blank').notEmpty();
        req.sanitize('email').normalizeEmail({remove_dots : false});
        var errors =req.validationErrors();
        if (errors) { 
            return res.status(400).send(errors);
         }
         else{
             userService.forgetPassword(req,res)
         } 
    }
    
    exports.updatePassword = function(req,res){
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        var errors = req.validationErrors();
        if (errors) { 
            return res.status(400).send(errors);
         }
         else{
             userService.updatePassword(req,res)
         } 
    
    }
    
    exports.resetPassword = function(req,res){
        req.assert('password', 'Password must be at least 4 characters long').len(4);
        var errors = req.validationErrors();
        if (errors) { 
            return res.status(400).send(errors);
         }
         else{
             userService.updatePassword(req,res)
         } 
    }