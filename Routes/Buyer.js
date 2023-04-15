const express = require('express');
const { getOneOrder, getAllOrders, deleteOneOrder, acceptOrder } = require('../Controllers/BuyerOrder/BuyerOrder');
const payment = require('../Controllers/PlaceOrder/Payment');
const { placeOrder, intent } = require('../Controllers/PlaceOrder/PlaceOrder');
const { auth } = require('../Middlewares/auth')
const router = express.Router();
router.post("/place-order/payment", auth, payment)
router.post("/place-order", auth, placeOrder)
router.post("/get-client-secret", auth, intent)
router.get('/get-one-order/:orderId', auth, getOneOrder)
router.get('/get-all-orders', auth, getAllOrders)
router.delete('/delete-one-order/:orderId', auth, deleteOneOrder)
router.patch('/accept-order/:orderId', auth, acceptOrder)
module.exports = router;