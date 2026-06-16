const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const { authMiddleware } = require('../middleware/authMiddleware');

// User routes
router.post('/create', authMiddleware, OrderController.createOrder);
router.get('/my-orders', authMiddleware, OrderController.getAllOrderDetails);
router.get('/details/:id', authMiddleware, OrderController.getDetailsOrder);

// Admin routes
router.get('/get-all-orders', authMiddleware, OrderController.getAllOrder);
router.put('/update-status/:id', authMiddleware, OrderController.updateOrderStatus);

module.exports = router;
