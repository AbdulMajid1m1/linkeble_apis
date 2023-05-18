const express = require('express')
const router = express.Router()
const sendOffer = require('../Controllers/sendOffer/sendOffer');

router.post('/sendoffer', sendOffer.sendOfferPost);

module.exports = router
