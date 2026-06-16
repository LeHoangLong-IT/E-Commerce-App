const express = require('express');
const router = express.Router();
const CartController = require('../controllers/CartController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, CartController.addToCart);
router.get('/', authMiddleware, CartController.getCart);
router.put('/update/:id', authMiddleware, CartController.updateCartItemQuantity);
router.delete('/remove/:id', authMiddleware, CartController.removeCartItem);

module.exports = router;
