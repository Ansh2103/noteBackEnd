var express = require('express');
const router = express.Router();
expressValidator = require('express-validator')
var userController = require('../controller/user.controller')
router.use(expressValidator())
router.post('/',userController.createUser)
router.get('/verify/:token',userController.confirmAccount);
router.post('/login',userController.login);
router.post('/forgetPassword',userController.forgetPassword);
router.post('/updatePassword/:token',userController.updatePassword);
router.post('/forgetPassword/:token',userController.resetPassword);

module.exports = router

// router.get('/verify/:token',userController.confirmAccount)
// router.post('/login',userController.login);
// router.post('/resetpassword',userController.passwordReset);
//module.exports=router;