var resHandler = require('../common-functions/response-handler');
var resCode = require('../helper/response-code');
var resMsg = require('../helper/response-message');
var cartModel = require('../models/cart-model');
var productModel = require('../models/product-model');
const async = require('async');
let addToCart = (req, res) => {
    /*
     {
        "productId": "5c56b21ddd7a741e341429d2"
    }
     */
    resHandler.Validator(req.body, 'productId')
    .then(async (resValid) => {
        try {
            let productDet = await productModel.findOne({_id: req.body.productId, status: 'ACTIVE', quantity: { $gte: 1}});
            if(!productDet) {
                return resHandler.ResponseWOData(res, resCode.NOT_FOUND, resMsg.NOT_FOUND);
            }
            console.log('productDet =>>', productDet);
            /* if(productDet.quantity < 1) {
                return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.NO_QUANTITY)
            } */

            let cart = await cartModel.find({})
            console.log('cart ==>> ', JSON.stringify(cart));
            if(cart.length) {

                let availbleProd = await cartModel.findOne({_id: cart[0]._id, data: {
                    $elemMatch: {
                        product: req.body.productId,
                        quantity: {
                            $gte: productDet.quantity
                        }
                    }
                }})
                if(availbleProd) {
                    return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.NO_QUANTITY);
                }
                // Product is already added to cart
                let query = {
                    $inc: {
                        "data.$.quantity": 1
                        // "data.$.price": productDet.price
                    }
                }
                /* let find = {
                    _id: cart[0]._id,
                    data: {
                        $elemMatch: {
                            product: req.body.productId,
                            quantity: {
                                $lte: productDet.quantity
                            }
                        }
                    }
                } */
                let find = {
                    _id: cart[0]._id,
                    "data.product": req.body.productId 
                }
                let updated = await cartModel.findOneAndUpdate(find, query, {new: true, lean: true})
                

                if(!updated) {
                    // Product is new for the cart
                    let updQuery = {
                        $push: {
                            data: {
                                product: req.body.productId
                                // price: productDet.price
                            }
                        }
                    }
                    let data = await cartModel.findOneAndUpdate({_id: cart[0]._id}, updQuery, {new: true, lean: true});
                    return resHandler.ResponseWData(res, resCode.OK, resMsg.ADDED_TO_CART, data);
                    // return resHandler.ResponseWData(res, resCode.NOT_FOUND, resMsg.NOT_FOUND);
                } else
                    return resHandler.ResponseWData(res, resCode.OK, resMsg.ADDED_TO_CART, updated)
            } else {
                // Cart is not made , so create Cart Document
                let newCart = new cartModel({
                    data: [{
                        product: req.body.productId
                        // price: productDet.price
                    }]
                })
                newCart.save((err, saved) => {
                    if(err) {
                        return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
                    } else {
                        return resHandler.ResponseWData(res, resCode.OK, resMsg.ADDED_TO_CART, saved);
                    }
                })
            }
        } catch(error) {
            console.log('catch erro r=> ', error)
            return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
        }
    })
    .catch(errValid => {
        return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.REQUIRED);    
    })
}

let checkout = (req, res) => {
    resHandler.Validator(req.body, 'cartId')
    .then(async (resValid) => {
        try {
            let cart = await cartModel.findOne({_id:  req.body.cartId} )
            .populate({
                path: 'data.product',
                match: {
                    status: 'ACTIVE'
                }
            })
            // console.log('cart data =>> ', JSON.stringify(cart))
            let data = [...cart.data];
            for(let i = 0; i < data.length; i++) {
                if(!data[i].product) {
                    return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, 'One Product is deleted');
                    break;
                }
                if(data[i].product.quantity < data[i].quantity){
                    return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, data[i].product.name+' Quantity is not sufficient');
                    break;
                }
            }
            console.log('data =>> ', data)
            async.each(data, async function iteratee(item, callback) {
                
                console.log('async series =>> ', JSON.stringify(item));
                let updated = await productModel.findOneAndUpdate({_id: item.product._id}, {$inc: {
                        quantity: -item.quantity
                    }
                })
                
                if(item._id == data[data.length - 1]._id)
                    callback(null, cache[item]);
            }, async function done() {
                console.log('done ')
                let emptyCart = await cartModel.findOneAndUpdate({_id: req.body.cartId}, {$set: { data: [] } })
                if(!emptyCart) {
                    return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR)
                }
                return resHandler.ResponseWOData(res, resCode.OK, resMsg.PAYMENT_SUCCESSFULL);
            });

            
            
        } catch(error) {
            console.log('catch error =>>', error)
            return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
        }
    })
    .catch((errValid) => {
        return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.REQUIRED);    
    })
} 

module.exports = {
    addToCart,
    checkout
}