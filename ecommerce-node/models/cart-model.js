var mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    data: [ {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'productModel'
        },
        quantity: Number,
        price: Number
    } ],
    price: Number
}, { timestamps: {} });

let cartModel = mongoose.model('cartModel', cartSchema);
module.exports = cartModel;

