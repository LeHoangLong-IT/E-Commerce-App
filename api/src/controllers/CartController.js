const CartService = require('../services/CartService');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        // In a real app with auth middleware, you'd get userId from req.user.id
        // For now, if the app relies on headers or body, let's assume it's passed or from auth
        // Assuming there's a middleware that sets req.user
        if (!req.user || !req.user.id) {
             return res.status(401).json({ status: 'ERR', message: 'Unauthorized' });
        }
        const userId = req.user.id;

        if (!productId || !quantity) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu productId hoặc quantity'
            });
        }

        const response = await CartService.addToCart(userId, Number(productId), Number(quantity));
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error from server'
        });
    }
};

const getCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
             return res.status(401).json({ status: 'ERR', message: 'Unauthorized' });
        }
        const userId = req.user.id;

        const response = await CartService.getCart(userId);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error from server'
        });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
             return res.status(401).json({ status: 'ERR', message: 'Unauthorized' });
        }
        const userId = req.user.id;
        const cartItemId = req.params.id;
        const { quantity } = req.body;

        if (!cartItemId || quantity === undefined) {
             return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu cartItemId hoặc quantity'
            });
        }

        const response = await CartService.updateCartItemQuantity(userId, Number(cartItemId), Number(quantity));
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error from server'
        });
    }
};

const removeCartItem = async (req, res) => {
    try {
         if (!req.user || !req.user.id) {
             return res.status(401).json({ status: 'ERR', message: 'Unauthorized' });
        }
        const userId = req.user.id;
        const cartItemId = req.params.id;

        if (!cartItemId) {
             return res.status(400).json({
                status: 'ERR',
                message: 'Thiếu cartItemId'
            });
        }

        const response = await CartService.removeCartItem(userId, Number(cartItemId));
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e.message || 'Error from server'
        });
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeCartItem
};
