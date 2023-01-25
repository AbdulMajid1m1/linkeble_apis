const express = require('express')
const router = express.Router()
router.use('/', require('./Login'))
router.use('/', require('./Talent'))
router.use('/guest', require('./Guest'))
router.use('/buyer', require('./Buyer'))
module.exports = router
