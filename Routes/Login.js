const express = require('express')
const { SignUp, SignIn, forgetPasswordStepOne, forgetPasswordStepTwo, resetPassword } = require('../Controllers/Login')
const { auth } = require('../Middlewares/auth')
const router = express.Router()
router.post('/signup', SignUp)
router.post('/signIn', SignIn)
router.post('/forget-password/send-email', forgetPasswordStepOne)
router.post('/forget-password/verify-code', forgetPasswordStepTwo)
router.post('/forget-password/reset-password', resetPassword)
module.exports = router

