const mongoose = require('mongoose');
const Joi = require('joi');
const CreateService = require('../../Models/CreateService');

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


module.exports = { createServiceStepOne, createServiceStepTwo }




