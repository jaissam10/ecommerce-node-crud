var resHandler = require('../common-functions/response-handler');
var resCode = require('../helper/response-code');
var resMsg = require('../helper/response-message');
var cartModel = require('../models/cart-model');

let addToCart = (req, res) => {
    resHandler.Validator(req.body, 'productId')
    .then(async (resValid) => {
        try {
            let cart = await cartModel.find({})
            console.log('cart ==>> ', cart);
            if(cart.length) {
                let query = { $set: {
                        $push: {
                            data: {
                                product: req.body.productId,
                                quantity: req.body.quantity
                            }
                        }
                    }
                }
                
            } else {
                // let  = req.body;
                // delete query._id;
                
                let newCart = new cartModel({
                    data: [{
                        product: req.body.productId,
                        quantity: req.body.quantity
                    }]
                })
                newCart.save((err, saved) => {
                    if(err) {
                        return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
                    } else {
                        return resHandler.ResponseWData(res, resCode.OK, resMsg.ADDED_TO_CART, saved);
                    }
                })
                // let data = await cartModel.findOneAndUpdate({_id: cart._id}, {$set: query}, {new: true, lean: true});
                // console.log('update => ', data)
              /*   if(!data) {
                    // return resHandler.ResponseWData(res, resCode.NOT_FOUND, resMsg.NOT_FOUND);
                } else {
                    return resHandler.ResponseWData(res, resCode.OK, resMsg.ADDED_TO_CART, data)
                }  */
            }
        } catch(error) {
            return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
        }
    })
    .catch(errValid => {
        return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.REQUIRED);    
    })
}

module.exports = {
    addToCart
}