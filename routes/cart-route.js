var router = require('express').Router();
var cartController = require('../webservices/cart-controller');

router.post('/add-to-cart', cartController.addToCart);
router.post('/checkout', cartController.checkout);

module.exports = router;