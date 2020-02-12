var express = require('express');
var router = express.Router();

var productController = require('../webservices/product-controller');

router.post('/add-product', productController.addProduct);
router.patch('/update-product', productController.updateProduct)
router.delete('/delete-product', productController.deleteProduct);

module.exports = router;