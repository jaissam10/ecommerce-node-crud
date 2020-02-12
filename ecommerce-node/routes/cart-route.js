var router = require('express').Router();
var cartController = require('../webservices/cart-controller');

router.post('/addToCart', cartController.addToCart);

module.exports = router;