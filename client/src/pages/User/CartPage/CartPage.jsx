import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartApi from '../../../api/cartApi';
import './CartPage.scss';
import { notification } from 'antd';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await cartApi.getCart();
            if (res.status === 'OK') {
                setCartItems(res.data);
            }
        } catch (error) {
            console.error(error);
            notification.error({ message: 'Lỗi tải giỏ hàng', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/sign-in');
            return;
        }
        fetchCart();
    }, []);

    const handleQuantityChange = async (id, currentQty, amount) => {
        const newQty = currentQty + amount;
        if (newQty <= 0) {
            handleRemoveItem(id);
            return;
        }

        try {
            const res = await cartApi.updateQuantity(id, { quantity: newQty });
            if (res.status === 'OK') {
                fetchCart();
            } else {
                notification.error({ message: 'Lỗi', description: res.message });
            }
        } catch (error) {
            notification.error({ message: 'Lỗi', description: error.response?.data?.message || 'Có lỗi xảy ra' });
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            const res = await cartApi.removeCartItem(id);
            if (res.status === 'OK') {
                notification.success({ message: 'Đã xóa khỏi giỏ hàng' });
                // remove from selected if there
                setSelectedItems(prev => prev.filter(itemId => itemId !== id));
                fetchCart();
            }
        } catch (error) {
            notification.error({ message: 'Lỗi', description: 'Có lỗi xảy ra khi xóa' });
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems(prev => {
            if (prev.includes(id)) {
                return prev.filter(itemId => itemId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(cartItems.map(item => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            if (selectedItems.includes(item.id)) {
                const price = item.product.sale_price > 0 ? item.product.sale_price : item.product.price;
                total += price * item.quantity;
            }
        });
        return total;
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            notification.warning({ message: 'Vui lòng chọn sản phẩm để thanh toán' });
            return;
        }
        
        // Pass selected item IDs to checkout page
        // For example via state
        navigate('/checkout', { state: { selectedItems } });
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h2>Giỏ hàng của bạn</h2>
                
                {loading ? (
                    <p>Đang tải...</p>
                ) : cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Giỏ hàng trống.</p>
                        <button onClick={() => navigate('/products')}>Tiếp tục mua sắm</button>
                    </div>
                ) : (
                    <>
                        <div className="cart-header">
                            <div className="col-checkbox">
                                <input 
                                    type="checkbox" 
                                    checked={selectedItems.length === cartItems.length && cartItems.length > 0} 
                                    onChange={handleSelectAll}
                                />
                            </div>
                            <div className="col-product">Sản phẩm</div>
                            <div className="col-price">Đơn giá</div>
                            <div className="col-quantity">Số lượng</div>
                            <div className="col-total">Số tiền</div>
                            <div className="col-action">Thao tác</div>
                        </div>

                        <div className="cart-list">
                            {cartItems.map(item => {
                                const price = item.product.sale_price > 0 ? item.product.sale_price : item.product.price;
                                const isSelected = selectedItems.includes(item.id);

                                return (
                                    <div className="cart-item" key={item.id}>
                                        <div className="col-checkbox">
                                            <input 
                                                type="checkbox" 
                                                checked={isSelected}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                        </div>
                                        <div className="col-product">
                                            <img src={item.product.image} alt={item.product.name} />
                                            <div className="product-info">
                                                <span className="name">{item.product.name}</span>
                                            </div>
                                        </div>
                                        <div className="col-price">
                                            {Number(price).toLocaleString('vi-VN')} ₫
                                        </div>
                                        <div className="col-quantity">
                                            <div className="quantity-control">
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity, -1)}>-</button>
                                                <input type="text" value={item.quantity} readOnly />
                                                <button onClick={() => handleQuantityChange(item.id, item.quantity, 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="col-total">
                                            {(Number(price) * item.quantity).toLocaleString('vi-VN')} ₫
                                        </div>
                                        <div className="col-action">
                                            <button className="btn-delete" onClick={() => handleRemoveItem(item.id)}>Xóa</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-summary">
                                <span>Tổng thanh toán ({selectedItems.length} sản phẩm): </span>
                                <span className="total-price">{calculateTotal().toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <button className="btn-checkout" onClick={handleCheckout}>
                                Mua Hàng
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
