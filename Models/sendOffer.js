const mongoose = require("mongoose")
const sendOfferSchema = new mongoose.Schema({

    description: { type: String, required: true },
    budget: { type: String, required: true },
    delivery_time: { type: String, required: true },
    revisions: { type: String, required: true },
    services: { type: String, required: true },

})
module.exports = mongoose.model("SendOffer", sendOfferSchema)
