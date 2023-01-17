const express = require('express')
const route = express.Router()
route.use('/', require('./Login'))
route.use('/', require('./Talent'))
module.exports = route