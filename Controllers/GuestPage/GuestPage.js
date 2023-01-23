const CreateService = require("../../Models/CreateService")


const getAllServices = async (req, res) => {
    try {
        const services = await CreateService.find();
        res.status(200).json({ success: true, services })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}

const getSearchServices = async (req, res) => {
    try {
        // const services = await CreateService.find({category: req.body.category, subcategory: req.body.subcategory});
        const services = await CreateService.find({ category: req.params.category });

        res.status(200).json({ success: true, services })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })

    }
}



module.exports = { getAllServices, getSearchServices }
