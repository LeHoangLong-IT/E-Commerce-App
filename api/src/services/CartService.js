const prisma = require('../config/prisma');

const addToCart = async (userId, productId, quantity) => {
    try {
        // 1. Check if product exists and stock
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return {
                status: 'ERR',
                message: 'Product not found'
            };
        }

        if (product.count_in_stock < quantity) {
            return {
                status: 'ERR',
                message: 'Sản phẩm không đủ số lượng trong kho'
            };
        }

        // 2. Get or create cart for user
        let cart = await prisma.cart.findUnique({
            where: { user_id: userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { user_id: userId }
            });
        }

        // 3. Check if item already in cart
        const existingCartItem = await prisma.cart_item.findUnique({
            where: {
                cart_id_product_id: {
                    cart_id: cart.id,
                    product_id: productId
                }
            }
        });

        if (existingCartItem) {
            // Update quantity
            const newQuantity = existingCartItem.quantity + quantity;
            if (product.count_in_stock < newQuantity) {
                 return {
                    status: 'ERR',
                    message: 'Sản phẩm không đủ số lượng trong kho'
                };
            }

            await prisma.cart_item.update({
                where: { id: existingCartItem.id },
                data: { quantity: newQuantity }
            });
        } else {
            // Create new cart item
            await prisma.cart_item.create({
                data: {
                    cart_id: cart.id,
                    product_id: productId,
                    quantity: quantity
                }
            });
        }

        return {
            status: 'OK',
            message: 'Đã thêm vào giỏ hàng'
        };

    } catch (e) {
        throw e;
    }
};

const getCart = async (userId) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { user_id: userId },
            include: {
                cart_items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                sale_price: true,
                                image: true,
                                count_in_stock: true,
                                slug: true
                            }
                        }
                    },
                    orderBy: {
                         id: 'desc'
                    }
                }
            }
        });

        if (!cart) {
            return {
                status: 'OK',
                message: 'Success',
                data: []
            };
        }

        return {
            status: 'OK',
            message: 'Success',
            data: cart.cart_items
        };
    } catch (e) {
        throw e;
    }
};

const updateCartItemQuantity = async (userId, cartItemId, quantity) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { user_id: userId }
        });

        if (!cart) {
            return { status: 'ERR', message: 'Cart not found' };
        }

        const cartItem = await prisma.cart_item.findUnique({
            where: { id: cartItemId },
            include: { product: true }
        });

        if (!cartItem || cartItem.cart_id !== cart.id) {
            return { status: 'ERR', message: 'Cart item not found' };
        }

        if (quantity <= 0) {
            await prisma.cart_item.delete({
                where: { id: cartItemId }
            });
            return { status: 'OK', message: 'Removed from cart' };
        }

        if (cartItem.product.count_in_stock < quantity) {
             return { status: 'ERR', message: 'Sản phẩm không đủ số lượng trong kho' };
        }

        const updated = await prisma.cart_item.update({
            where: { id: cartItemId },
            data: { quantity: quantity }
        });

        return {
            status: 'OK',
            message: 'Cập nhật số lượng thành công',
            data: updated
        };
    } catch (e) {
        throw e;
    }
};

const removeCartItem = async (userId, cartItemId) => {
     try {
        const cart = await prisma.cart.findUnique({
            where: { user_id: userId }
        });

        if (!cart) {
            return { status: 'ERR', message: 'Cart not found' };
        }

        const cartItem = await prisma.cart_item.findUnique({
            where: { id: cartItemId }
        });

        if (!cartItem || cartItem.cart_id !== cart.id) {
            return { status: 'ERR', message: 'Cart item not found' };
        }

        await prisma.cart_item.delete({
            where: { id: cartItemId }
        });

        return {
            status: 'OK',
            message: 'Đã xóa sản phẩm khỏi giỏ hàng'
        };
    } catch (e) {
        throw e;
    }
}

module.exports = {
    addToCart,
    getCart,
    updateCartItemQuantity,
    removeCartItem
};
