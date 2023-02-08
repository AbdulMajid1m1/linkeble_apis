const express = require('express')
const { getAllServices, getSearchServices } = require('../Controllers/GuestPage/GuestPage')
const route = express.Router()


route.get("/all-services", getAllServices)
route.get("/search-services/:category", getSearchServices)


module.exports = route
