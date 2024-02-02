const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    colour: {
        type: String,

    },
    size: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    productImage: {
        type:Array,
        required: true
    }
});

const Product = mongoose.model('Products', productSchema);

module.exports =Product;