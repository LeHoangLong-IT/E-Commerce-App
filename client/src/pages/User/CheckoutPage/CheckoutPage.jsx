import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notification, Spin, Form, Input, Select, Button, Radio } from 'antd';
import axios from 'axios';
import orderApi from '../../../api/orderApi';
import cartApi from '../../../api/cartApi';
import './CheckoutPage.scss';

const { Option } = Select;

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [form] = Form.FormuseForm ? Form.useForm() : Form.useForm();
    
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    // Address states
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const selectedItemIds = location.state?.selectedItems || [];

    useEffect(() => {
        if (selectedItemIds.length === 0) {
            notification.warning({ message: 'Không có sản phẩm nào để thanh toán' });
            navigate('/cart');
            return;
        }
        fetchCartItems();
        fetchProvinces();
    }, []);

    // Autofill user details
    useEffect(() => {
        const u = localStorage.getItem("user");
        if (u) {
            const userObj = JSON.parse(u);
            form.setFieldsValue({
                fullName: userObj.name,
                phone: userObj.phone,
                address: userObj.address
            });
        }
    }, [form]);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const res = await cartApi.getCart();
            if (res.status === 'OK') {
                const itemsToCheckout = res.data.filter(item => selectedItemIds.includes(item.id));
                setCartItems(itemsToCheckout);
                
                let total = 0;
                itemsToCheckout.forEach(item => {
                    const price = item.product.sale_price > 0 ? item.product.sale_price : item.product.price;
                    total += price * item.quantity;
                });
                setTotalPrice(total);
            }
        } catch (error) {
            notification.error({ message: 'Lỗi tải thông tin sản phẩm', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('https://provinces.open-api.vn/api/p/');
            setProvinces(res.data);
        } catch (error) {
            console.error("Lỗi tải tỉnh thành:", error);
        }
    };

    const handleProvinceChange = async (value) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        setWards([]);
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${value}?depth=2`);
            setDistricts(res.data.districts);
        } catch (error) {
            console.error("Lỗi tải quận huyện:", error);
        }
    };

    const handleDistrictChange = async (value) => {
        form.setFieldsValue({ ward: undefined });
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${value}?depth=2`);
            setWards(res.data.wards);
        } catch (error) {
            console.error("Lỗi tải phường xã:", error);
        }
    };

    const handlePlaceOrder = async (values) => {
        const provinceName = provinces.find(p => p.code === values.province)?.name || '';
        const districtName = districts.find(d => d.code === values.district)?.name || '';
        const wardName = wards.find(w => w.code === values.ward)?.name || '';
        
        const fullAddress = `${values.address}, ${wardName}, ${districtName}, ${provinceName}`;

        const orderItems = cartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.sale_price > 0 ? item.product.sale_price : item.product.price
        }));

        const orderData = {
            orderItems: orderItems,
            paymentMethod: values.paymentMethod,
            shippingAddress: fullAddress,
            phone: values.phone,
            totalPrice: totalPrice,
            fullName: values.fullName
        };

        try {
            setPlacingOrder(true);
            const res = await orderApi.createOrder(orderData);
            if (res.status === 'OK') {
                notification.success({ 
                    message: 'Đặt hàng thành công!',
                    description: 'Đơn hàng của bạn đã được ghi nhận.'
                });
                navigate('/my-orders');
            } else {
                notification.error({ message: 'Có lỗi xảy ra', description: res.message });
            }
        } catch (error) {
            notification.error({ 
                message: 'Lỗi đặt hàng', 
                description: error.response?.data?.message || error.message 
            });
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h2>Thanh Toán Đơn Hàng</h2>
                
                <div className="checkout-content">
                    <div className="checkout-form-section">
                        <h3>Thông tin giao hàng</h3>
                        <Form 
                            form={form} 
                            layout="vertical" 
                            onFinish={handlePlaceOrder}
                            initialValues={{ paymentMethod: 'COD' }}
                        >
                            <Form.Item 
                                label="Họ và Tên" 
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input size="large" placeholder="Nhập họ và tên người nhận" />
                            </Form.Item>

                            <Form.Item 
                                label="Số điện thoại" 
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                            >
                                <Input size="large" placeholder="Nhập số điện thoại" />
                            </Form.Item>

                            <div className="address-dropdowns">
                                <Form.Item 
                                    label="Tỉnh / Thành phố" 
                                    name="province"
                                    rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành' }]}
                                    style={{ flex: 1 }}
                                >
                                    <Select size="large" placeholder="Chọn Tỉnh / Thành" onChange={handleProvinceChange} showSearch optionFilterProp="children">
                                        {provinces.map(p => (
                                            <Option key={p.code} value={p.code}>{p.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item 
                                    label="Quận / Huyện" 
                                    name="district"
                                    rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}
                                    style={{ flex: 1 }}
                                >
                                    <Select size="large" placeholder="Chọn Quận / Huyện" onChange={handleDistrictChange} showSearch optionFilterProp="children" disabled={!districts.length}>
                                        {districts.map(d => (
                                            <Option key={d.code} value={d.code}>{d.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item 
                                    label="Phường / Xã" 
                                    name="ward"
                                    rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}
                                    style={{ flex: 1 }}
                                >
                                    <Select size="large" placeholder="Chọn Phường / Xã" showSearch optionFilterProp="children" disabled={!wards.length}>
                                        {wards.map(w => (
                                            <Option key={w.code} value={w.code}>{w.name}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <Form.Item 
                                label="Địa chỉ cụ thể (Số nhà, tên đường)" 
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                            >
                                <Input size="large" placeholder="Nhập số nhà, tên đường..." />
                            </Form.Item>

                            <h3 style={{ marginTop: '30px' }}>Phương thức thanh toán</h3>
                            <Form.Item name="paymentMethod">
                                <Radio.Group className="payment-methods">
                                    <Radio value="COD" className="payment-radio">
                                        <div className="payment-info">
                                            <img src="https://cdn-icons-png.flaticon.com/512/2800/2800155.png" alt="COD" />
                                            <span>Thanh toán khi nhận hàng (COD)</span>
                                        </div>
                                    </Radio>
                                    <Radio value="VNPAY" className="payment-radio" disabled>
                                        <div className="payment-info">
                                            <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png" alt="VNPay" />
                                            <span>Thanh toán VNPay (Đang phát triển)</span>
                                        </div>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="btn-place-order" 
                                size="large" 
                                loading={placingOrder}
                            >
                                HOÀN TẤT ĐẶT HÀNG
                            </Button>
                        </Form>
                    </div>

                    <div className="checkout-summary-section">
                        <h3>Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>
                        <div className="summary-items">
                            {cartItems.map(item => {
                                const price = item.product.sale_price > 0 ? item.product.sale_price : item.product.price;
                                return (
                                    <div className="summary-item" key={item.id}>
                                        <img src={item.product.image} alt={item.product.name} />
                                        <div className="item-info">
                                            <div className="item-name">{item.product.name}</div>
                                            <div className="item-qty">Số lượng: x{item.quantity}</div>
                                        </div>
                                        <div className="item-price">
                                            {(price * item.quantity).toLocaleString('vi-VN')} ₫
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Tạm tính</span>
                                <span>{totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="total-row">
                                <span>Phí vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="total-row final">
                                <span>Tổng cộng</span>
                                <span className="final-price">{totalPrice.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
