const express = require('express')
const { SignUp, SignIn } = require('../Controllers/Login')
const route = express.Router()
route.post('/signup', SignUp)
route.post('/signIn', SignIn)
module.exports = route