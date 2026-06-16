const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, shippingAddress, phone, totalPrice, userId } = newOrder;
        
        try {
            // Use transaction to ensure data integrity
            const result = await prisma.$transaction(async (prisma) => {
                // 1. Verify and update stock for all items
                for (const item of orderItems) {
                    const product = await prisma.product.findUnique({
                        where: { id: item.product_id }
                    });

                    if (!product) {
                        throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
                    }

                    if (product.count_in_stock < item.quantity) {
                        throw new Error(`Sản phẩm ${product.name} không đủ số lượng trong kho`);
                    }

                    // Update stock and sold count
                    await prisma.product.update({
                        where: { id: item.product_id },
                        data: {
                            count_in_stock: product.count_in_stock - item.quantity,
                            sold: product.sold + item.quantity
                        }
                    });
                }

                // 2. Create the Order
                const createdOrder = await prisma.order.create({
                    data: {
                        user_id: userId,
                        total_price: totalPrice,
                        payment_method: paymentMethod,
                        shipping_address: shippingAddress,
                        phone: phone,
                        status: 'PENDING',
                        is_paid: false,
                        order_items: {
                            create: orderItems.map(item => ({
                                product_id: item.product_id,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        }
                    },
                    include: {
                        order_items: true
                    }
                });

                // 3. Remove items from user's cart
                const cart = await prisma.cart.findUnique({
                    where: { user_id: userId }
                });

                if (cart) {
                    const productIdsToRemove = orderItems.map(item => item.product_id);
                    await prisma.cart_item.deleteMany({
                        where: {
                            cart_id: cart.id,
                            product_id: { in: productIdsToRemove }
                        }
                    });
                }

                return createdOrder;
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: result
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    order_items: {
                        include: {
                            product: true
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: order
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrderDetails = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await prisma.order.findMany({
                where: {
                    user_id: Number(userId)
                },
                include: {
                    order_items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: orders
            });
        } catch (e) {
            reject(e);
        }
    });
};

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await prisma.order.findMany({
                include: {
                    order_items: true,
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateOrderStatus = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await prisma.order.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if (!checkOrder) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                });
            }

            const updatedOrder = await prisma.order.update({
                where: { id: Number(id) },
                data: {
                    status: data.status !== undefined ? data.status : checkOrder.status,
                    is_paid: data.is_paid !== undefined ? data.is_paid : checkOrder.is_paid
                }
            });

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedOrder
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createOrder,
    getOrderDetails,
    getAllOrderDetails,
    getAllOrder,
    updateOrderStatus
};
