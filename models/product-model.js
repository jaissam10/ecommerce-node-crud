var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'DELETE'],
        default: 'ACTIVE'
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    }
}, { timestamps: {} })

var productModel = mongoose.model('productModel', productSchema);
module.exports = productModel;