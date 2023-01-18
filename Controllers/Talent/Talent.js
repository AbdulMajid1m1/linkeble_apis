const mongoose = require('mongoose');
const Joi = require('joi');
const CreateService = require('../../Models/CreateService');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const createServiceStepOne = async (req, res) => {
    const value = Joi.object({
        title: Joi.string().max(90).required(),
        description: Joi.string().max(1200).required(),
        category: Joi.string().required(),
        subcategory: Joi.string().required(),
        serviceTags: Joi.array().items(Joi.string()).min(1).max(5).required(),

    }).validate(req.body)
    if (value.error) {
        return res.status(400).json({ success: false, message: value.error.details[0].message })
    }
    const { title, description, category, subcategory, serviceTags } = req.body;
    const ifServiceExit = await CreateService.findOne({ user_id: req.payload._id })
    if (!ifServiceExit) {
        const service = new CreateService({
            user_id: req.payload._id,
            title,
            description,
            category,
            subcategory,
            serviceTags
        })

        console.log(req.payload._id)
        try {
            data = await service.save()
            return res.status(200).json({ success: true, message: 'service created successfully', data: data })

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message })
        }
    }
    else {
        const service = await CreateService.findOneAndUpdate({ user_id: req.payload._id }, {
            $set: {
                user_id: req.payload._id,
                title,
                description,
                category,
                subcategory,
                serviceTags
            }

        }, { new: true })
        console.log(req.payload._id)
        return res.status(200).json({ success: true, message: 'service updated successfully', data: service })
    }

}


const createServiceStepTwo = async (req, res) => {
    const IfServiceExit = CreateService.findOne({ user_id: req.payload._id });
    if (!IfServiceExit) {
        return res.status(400).json({ success: false, message: 'please complete previous step first' })
    }
    const InnerValues = Joi.object().keys({
        packageName: Joi.string().required(),
        packageDetails: Joi.string().required(),
        delivery: Joi.number().required(),
        totalScreen: Joi.number().required(),
        prototype: Joi.boolean().required(),
        revisions: Joi.number().required(),
        price: Joi.number().required(),
    })

    const values = Joi.object({
        basic: InnerValues,
        standard: InnerValues,
        premium: InnerValues,
    }).validate(req.body)
    if (values.error) {
        return res.status(400).json({ success: false, message: values.error.details[0].message })
    }
    const updateService = await CreateService.findOneAndUpdate({ user_id: req.payload._id }, {
        $set: {
            pricing: req.body
        },
    }, { new: true })
    return res.status(200).json({ success: true, message: 'service updated successfully', data: updateService })

}


const createServiceStepThree = async (req, res) => {
    const IfServiceExit = CreateService.findOne({ user_id: req.payload._id });
    if (!IfServiceExit) {
        return res.status(400).json({ success: false, message: 'please complete previous step first' })
    }
    const values = Joi.object({
        questions: Joi.array().items(Joi.string()),
        faqs: Joi.array().items(Joi.string()),
    }).validate(req.body)
    if (values.error) {
        return res.status(400).json({ success: false, message: values.error.details[0].message })
    }
    try {


        const updateService = await CreateService.findOneAndUpdate({ user_id: req.payload._id }, {
            $set: req.body
        }, { new: true })
        return res.status(200).json({ success: true, message: 'service updated successfully', data: updateService })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

const createServiceStepFour = async (req, res) => {
    const IfServiceExit = CreateService.findOne({ user_id: req.payload._id });
    if (!IfServiceExit) {
        return res.status(400).json({ success: false, message: 'please complete previous step first' })
    }
    const values = Joi.object({
        //servicesImages array of string and max length should be 3
        servicesImages: Joi.array().items(Joi.string()).max(3),
        // servicesImages: Joi.array().items(Joi.string()).max(3),
        serviceDocuments: Joi.array().items(Joi.string()).max(3),
        // termsAndConditions boolean required and value should be true
        termsAndConditions: Joi.boolean().required().valid(true),


    }).validate(req.body)
    if (values.error) {
        return res.status(400).json({ success: false, message: values.error.details[0].message })
    }
    try {
        // json format of req.body.servicesImages and req.body.serviceDocuments for postman


        // uplaod images and documents coming from req.body to cloudinary
        // "The \"path\" argument must be of type string. Received an instance of Array"
        // upload arry of images and documents to cloudinary and get secure_url

        const uploadImages = await cloudinary.uploader.upload(req.body.servicesImages[1], {
            folder: 'servicesImages',
        })
        const uploadDocuments = await cloudinary.uploader.upload(req.body.serviceDocuments[1], {
            folder: 'serviceDocuments',
        })
        
        // json format of uploadImages and uploadDocuments for postman for above cludinary code
        // add images and documents to req.body
        req.body.servicesImages = uploadImages.secure_url
        req.body.serviceDocuments = uploadDocuments.secure_url
        // update service
        const updateService = await CreateService.findOneAndUpdate({ user_id: req.payload._id }, {
            $set: req.body
        }, { new: true })
        return res.status(200).json({ success: true, message: 'service updated successfully', data: updateService })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }

}

module.exports = {
    createServiceStepOne,
    createServiceStepTwo,
    createServiceStepThree,
    createServiceStepFour
}




