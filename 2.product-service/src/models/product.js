const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    discountPrice: {
        type: Number,
        default: 0,
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        default: 0
    },

    images: [
        {
            url: String,
            public_id: String
        }
    ],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    ratingCount: {
        type: Number,
        default: 0
    },

    isFeatured: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true
});

const product = mongoose.model("Product", productSchema);

module.exports = product