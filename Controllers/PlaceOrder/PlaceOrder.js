const Joi = require("joi")
const Order = require("../../Models/Order")
const { default: mongoose } = require("mongoose")
const cloudinary = require("../../Utils/cloudinary.config")
const { uploadImages } = require("../../Utils/cloudinaryImgFunctions")
const placeOrder = async (req, res) => {
    const value = Joi.object({
        title: Joi.string().required(),
        details: Joi.string().required(),
        // attachments: Joi.alternatives().try(Joi.array().max(5), Joi.object()),
        attachments: Joi.any(),
        // FIXME: Reminder there is no option for selecting category and subcategory while placing order so they should come from the service
        // category: Joi.string().required(),
        // subcategory: Joi.string().required(),
        // FIXME: Reminder DeliveryTime should be a date coming from the service package delivery time and not from the user input as there is no option for selecting delivery time while placing order
        DeliveryTime: Joi.date().required(),
        budget: Joi.number().required(),
        package: Joi.string().required(),
        TermsAndContitions: Joi.boolean().valid(true).required(),
        // paymentId: Joi.string().required(),
        // validate the talentId and serviceId as any type
        talentId: Joi.any().required(),
        serviceId: Joi.any().required(),
        paymentId: Joi.any().required(),

    }).validate(req.body)
    if (value.error) {
        return res.status(400).send(value.error.details[0].message)
    }
    const { title,
        details,
        attachments,
        category,
        subcategory,
        DeliveryTime,
        budget,
        package,
        TermsAndContitions,
    } = req.body

    let uploadAttachments = [];

    if (req.files) {

        uploadAttachments = await uploadImages(req.files.attachments)
    }

    let talentId = mongoose.Types.ObjectId(req.body.talentId)
    let serviceId = mongoose.Types.ObjectId(req.body.serviceId)
    let paymentId = mongoose.Types.ObjectId(req.body.paymentId)

    const order = new Order({
        buyerId: req.payload.userData._id,
        talentId,
        serviceId,
        paymentId,
        title,
        details,
        attachments,
        category,
        subcategory,
        DeliveryTime,
        budget,
        package,
        TermsAndContitions,
        attachments: uploadAttachments,
    })
    try {
        const result = await order.save()
        res.status(200).json({ message: "Order Successfully placed", data: result })
    }
    catch (err) {
        res.status(500).json({ message: "Internal Server Error", err })
    }

}

module.exports = placeOrder

