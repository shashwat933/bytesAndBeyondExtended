const express = require('express');
const bcrypt = require('bcryptjs')
const userController=require('../controller/userController');


const router = express.Router();

//registering a user
router.post('/register',userController.postRegister);

//login a user
router.post('/login',userController.postLogin);

//getting a specific user
router.get('/current-user/:id' , userController.getUser);


module.exports = router;

 
