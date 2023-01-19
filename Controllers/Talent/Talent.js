const mongoose = require('mongoose');
const Joi = require('joi');
const CreateService = require('../../Models/CreateService');
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileupload = require('express-fileupload');


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
    // const values = Joi.object({
    //     //servicesImages array of string and max length should be 3
    //     servicesImages: Joi.array().items(Joi.string()).max(3),
    //     // servicesImages: Joi.array().items(Joi.string()).max(3),
    //     serviceDocuments: Joi.array().items(Joi.string()).max(3),
    //     // termsAndConditions boolean required and value should be true
    //     termsAndConditions: Joi.boolean().required().valid(true),


    // }).validate(req.body)
    // if (values.error) {
    //     return res.status(400).json({ success: false, message: values.error.details[0].message })
    // }
    try {
        // req.files return array of objects when we upload multiple files and single object when we upload single file how to detect that


        // uplaod multiple images coming from frontend to cloudinary directly without saving them locally on server and then uploading them to cloudinary
        const uploadImages = async (images) => {
            const urls = []
            if (Array.isArray(images)) {

                for (const image of images) {
                    try {


                        const newPath = await cloudinary.uploader.upload(image.tempFilePath, { folder: 'ServiceImages' })
                        urls.push(newPath.url)
                    } catch (error) {
                        return res.status(500).json({ success: false, message: error.message })

                    }

                }
            }
            else {
                try {
                    const newPath = await cloudinary.uploader.upload(images.tempFilePath, { folder: 'ServiceImages' })
                    urls.push(newPath.url)
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message })
                }
            }
            return urls
        }
        const uploadDocuments = async (documents) => {
            const urls = []
            if (Array.isArray(documents)) {

                for (const document of documents) {

                    try {
                        //  upload document to cloudinary in ServiceDocument folder and catch error if any
                        const newPath = await cloudinary.uploader.upload(document.tempFilePath, { folder: 'ServiceDocuments' })
                        urls.push(newPath.url)
                    } catch (error) {
                        return res.status(500).json({ success: false, message: error.message })
                    }


                }
            }
            else {
                try {
                    const newPath = await cloudinary.uploader.upload(documents.tempFilePath, { folder: 'ServiceDocuments' })
                    urls.push(newPath.url)
                } catch (error) {
                    return res.status(500).json({ success: false, message: error.message })
                }
                
            }
            return urls
        }
        const images = await uploadImages(req.files.servicesImages)
        const documents = await uploadDocuments(req.files.serviceDocuments)
        req.body.servicesImages = images
        req.body.serviceDocuments = documents



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




