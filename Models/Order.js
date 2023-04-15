const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    talentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "CreateService" },
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    title: { type: String },
    details: { type: String },
    attachments: { type: [Object], required: false, default: [], maxlength: 5 },
    category: { type: String },
    subcategory: { type: String },
    DeliveryTime: { type: Date },
    // budget: { type: Number },
    orderStatus: { type: String, default: "active" },
    package: { type: String },
    // isAccepted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    TermsAndContitions: { type: Boolean },
    paymentStatus: { type: Boolean, default: false },
    paymentIntentId: { type: String },
    // paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
}, { timestamps: true })

// TODO: Add a method to check if the order is completed or not in the backend
//TODO: Add a method to check if the order is accepted or not


module.exports = mongoose.model("Order", OrderSchema)

