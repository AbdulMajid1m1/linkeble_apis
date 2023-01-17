const express = require('express')
const { createServiceStepOne, createServiceStepTwo } = require('../Controllers/Talent/Talent')
const { auth } = require('../Middlewares/auth')
const route = express.Router()






route.post("/create-service/step-one", auth, createServiceStepOne)
route.post("/create-service/step-two", auth, createServiceStepTwo)


module.exports = route