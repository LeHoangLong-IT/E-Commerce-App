const OrderService = require('../services/OrderService');

const createOrder = async (req, res) => {
    try {
        const { orderItems, paymentMethod, shippingAddress, phone, totalPrice } = req.body;
        const userId = req.user.id;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Giỏ hàng trống'
            });
        }
        
        if (!shippingAddress || !phone || !totalPrice) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Vui lòng nhập đầy đủ thông tin giao hàng'
            });
        }

        const response = await OrderService.createOrder({
            orderItems, paymentMethod, shippingAddress, phone, totalPrice, userId
        });
        
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const response = await OrderService.getAllOrderDetails(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu mã đơn hàng'
            });
        }
        const response = await OrderService.getOrderDetails(orderId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const data = req.body;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu mã đơn hàng'
            });
        }
        const response = await OrderService.updateOrderStatus(orderId, data);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: e.message || 'Lỗi server'
        });
    }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    getAllOrder,
    updateOrderStatus
};
