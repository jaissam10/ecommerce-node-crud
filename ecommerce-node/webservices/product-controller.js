var resHandler = require('../common-functions/response-handler');
var resCode = require('../helper/response-code');
var resMsg = require('../helper/response-message');
var productModel = require('../models/product-model');

let addProduct = (req, res) => {
    /* Fields are
       {
        name: '',
        description: '',
        quantity: 2
        } */
    resHandler.Validator(req.body, 'name', 'description', 'quantity').then(async (resValid) => {
        try {
            let product = await productModel.findOne({name: req.body.name})
            if(product) {
                return resHandler.ResponseWOData(res, resCode.CONFLICT, resMsg.ALREADY_EXIST);
            } else {
                let product = new productModel({name: req.body.name, description: req.body.description, price: req.body.price})
                product.save((err, saved) => {
                    if(err)
                        return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
                    else {
                        return resHandler.ResponseWData(res, resCode.CREATED, resMsg.CREATED, saved);
                    }
                })
            }
        } catch (error) {
            return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
        }
    })
    .catch(errValid => {
        return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.REQUIRED);
    })
}

let updateProduct = (req, res) => {
    /* 
        {
            "_id": "5c5558f94d78c60dd843501a",
            "description": "no",
            "name": "Fr new"
        }
    */
    resHandler.Validator(req.body, '_id').then(async (resValid) => {
        try {
            let query =  {...req.body};
            delete query._id;
            // console.log('query => ', query);
            let data = await productModel.findOneAndUpdate({_id: req.body._id}, {$set: query}, {lean: true, new: true, upsert: true});
            if(!data) {
                return resHandler.ResponseWData(res, resCode.NOT_FOUND, resMsg.NOT_FOUND);
            } else {
                return resHandler.ResponseWData(res, resCode.OK, resMsg.UPDATED, data)
            }
            
        } catch (error) {
            return resHandler.ResponseWOData(res, resCode.INTERNAL_SERVER_ERROR, resMsg.INTERNAL_SERVER_ERROR);
        }
    })
    .catch(errValid => {
        return resHandler.ResponseWOData(res, resCode.BAD_REQUEST, resMsg.REQUIRED);
    }) 
}

let deleteProduct = (req, res) => {
    resHandler.Validator(req.body, '_id')
    .then(async (resValid) => {
        try {
            let query = {
                $set: {
                    status: 'DELETE'
                }
            }
            await productModel.findOneAndUpdate({_id: req.body._id}, query, {lean: true, new: true})
            if(!data) {
                return resHandler.ResponseWData(res, resCode.NOT_FOUND, resMsg.NOT_FOUND);
            } else {
                return resHandler.ResponseWData(res, resCode.OK, resMsg.DELETED)
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
    addProduct,
    updateProduct,
    deleteProduct
}