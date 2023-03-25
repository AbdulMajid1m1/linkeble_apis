const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
    category: { type: String, required: true, },
    subcategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    }],

}
    , { timestamps: true }
)



const subcategorySchema = new mongoose.Schema({

    name: { type: String, required: true, },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },

}
    , { timestamps: true }
)

const Category = mongoose.model("Category", CategorySchema)
const Subcategory = mongoose.model("Subcategory", subcategorySchema)
module.exports = { Category, Subcategory }




