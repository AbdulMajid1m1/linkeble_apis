const express = require('express')
const route = express.Router()
route.use('/', require('./Login'))
route.use('/', require('./Talent'))
route.use('/guest', require('./Guest'))
module.exports = route
