const mongoose = require('mongoose');
const CreateServiceSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: String,
        description: String,
        category: String,
        subcategory: String,
        serviceTags: { type: [String], minlength: 1, maxlength: 5 },
        pricing: {
            basic: {
                packageName: String,
                packageDetails: String,
                delivery: Number,
                totalScreen: Number,
                prototype: Boolean,
                revisions: Number,
                price: Number,
            },
            standard: {
                packageName: String,
                packageDetails: String,
                delivery: Number,
                totalScreen: Number,
                prototype: Boolean,
                revisions: Number,
                price: Number,
            },
            premium: {
                packageName: String,
                packageDetails: String,
                delivery: Number,
                totalScreen: Number,
                prototype: Boolean,
                revisions: Number,
                price: Number,
            },
        },
        questions: { type: [String], required: false },
        faqs: { type: [String], required: false },
        servicesImages: { type: [String], required: false, maxlength: 3 },
        serviceDocuments: { type: [String], required: false, maxlength: 3 },
        termsAndConditions: {
            type: Boolean,
        },
        serviceStatus: { type: String, default: 'pending' },

        // comments and reviews
        //  [{img:str,pid:str}]



    },
    { timestamps: true }
)
module.exports = mongoose.model("CreateService", CreateServiceSchema)
