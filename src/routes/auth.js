const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');

router.post('/user/register', authController.registerUser);

router.post('/user/login', authController.loginUser);

router.post('/user/email/verification', authController.userEmailVerication);

module.exports = router;