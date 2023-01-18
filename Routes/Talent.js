const express = require('express')
const { createServiceStepOne, createServiceStepTwo, createServiceStepThree, createServiceStepFour } = require('../Controllers/Talent/Talent')
const { auth } = require('../Middlewares/auth')
const route = express.Router()

route.post("/create-service/step-one", auth, createServiceStepOne)
route.post("/create-service/step-two", auth, createServiceStepTwo)
route.post("/create-service/step-three", auth, createServiceStepThree)
route.post("/create-service/step-four", auth, createServiceStepFour)


module.exports = route