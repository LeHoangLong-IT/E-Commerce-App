const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    OrderItems:[
        {
            name: {type: String, require: true},
            amount: {type: Number, require: true},
            image: {type: String, require: true},
            price: {type: Number, require: true},
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true,
            }
        }
    ]
    shippingAdress:{
            fullName: {type: String, require: true},
            address: {type: String, require: true},
            city: {type: String, require: true},
            phone: {type: number, require: true},
    },
    paymentMethod: {type: String, require: true},
    itemsPrice: {type: number, require: true},
    shippingPrice: {type: number, require: true},
    taxPrice: {type: number, require: true},
    totalPrice: {type: number, require: true},
    user: {
        type: mongoose.Schema.Types,ObjectId,
        ref: 'User',
        required: true,
    },
    isPaid: {type: Boolean, require: true},
    paidAt: {type: Date},
    isDelivered: {type: Boolean, require: true},
    deliveredAt: {type: Date},
},
{timestamps: true}
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;