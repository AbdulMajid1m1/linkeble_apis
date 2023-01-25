const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "CreateService" },
    title: { type: String, required: true },
    details: { type: String, required: true },
    attachments: { type: [Object], required: false, default: [], maxlength: 5 },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    DeliveryTime: { type: Date, required: true },
    budget: { type: Number, required: true },
    orderStatus: { type: String, default: "active" },
    package: { type: String, required: true },
    isAccepted: { type: Boolean, default: false },
    TermsAndContitions: { type: Boolean, required: true },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, { timestamps: true })

//TODO: Add a method to check if the order is accepted or not


module.exports = mongoose.model("Order", OrderSchema)

