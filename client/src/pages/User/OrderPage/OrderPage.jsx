import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin, notification, Button, Modal } from 'antd';
import orderApi from '../../../api/orderApi';
import moment from 'moment';
import './OrderPage.scss';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const res = await orderApi.getAllOrderDetails();
            if (res.status === 'OK') {
                setOrders(res.data);
            } else {
                notification.error({ message: 'Lỗi lấy đơn hàng', description: res.message });
            }
        } catch (error) {
            notification.error({ message: 'Lỗi', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Mã Đơn',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <b>#{text}</b>
        },
        {
            title: 'Ngày Đặt',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Tổng Tiền',
            dataIndex: 'total_price',
            key: 'total_price',
            render: (price) => <span style={{ color: '#ff424e', fontWeight: 'bold' }}>{Number(price).toLocaleString('vi-VN')}₫</span>
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                let text = 'Chờ xử lý';
                if (status === 'SHIPPING') { color = 'orange'; text = 'Đang giao hàng'; }
                if (status === 'DELIVERED') { color = 'green'; text = 'Đã giao hàng'; }
                if (status === 'CANCELLED') { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Thanh Toán',
            dataIndex: 'is_paid',
            key: 'is_paid',
            render: (is_paid) => is_paid ? <Tag color="green">Đã thanh toán</Tag> : <Tag color="default">Chưa thanh toán</Tag>
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetails(record)}>Xem chi tiết</Button>
            )
        }
    ];

    return (
        <div className="order-history-page">
            <div className="order-history-container">
                <h2>Lịch sử mua hàng</h2>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>
                ) : (
                    <Table 
                        dataSource={orders} 
                        columns={columns} 
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        scroll={{ x: 800 }}
                    />
                )}

                <Modal 
                    open={isModalVisible} 
                    onCancel={() => setIsModalVisible(false)}
                    footer={null}
                    width={800}
                    className="beautiful-order-modal"
                    closable={false}
                    styles={{ body: { padding: 0 } }}
                >
                    {selectedOrder && (
                        <div className="order-details-content">
                            {/* Header Section */}
                            <div className="order-header">
                                <div className="header-left">
                                    <div className="icon-box">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                        </svg>
                                    </div>
                                    <div className="title-and-badge">
                                        <h2 className="order-id">Đơn hàng #{selectedOrder.id}</h2>
                                        <div className={`status-badge status-${selectedOrder.status.toLowerCase()}`}>
                                            {selectedOrder.status === 'PENDING' ? 'Đang xử lý' : 
                                            selectedOrder.status === 'SHIPPING' ? 'Đang giao' : 
                                            selectedOrder.status === 'DELIVERED' ? 'Đã giao' : 'Đã hủy'}
                                        </div>
                                    </div>
                                </div>
                                <div className="header-right">
                                    <button className="btn-action">Theo dõi</button>
                                    <button className="btn-icon" onClick={() => setIsModalVisible(false)}>
                                        <svg className="icon-pc" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                        <svg className="icon-mobile" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Tracking Section */}
                            <div className="tracking-section">
                                <div className="tracking-subtitle">
                                    <span>{selectedOrder.status === 'DELIVERED' ? 'Đã giao hàng' : 'Đang giao hàng'}</span>
                                    <span className="est-time">Dự kiến: 3 ngày</span>
                                </div>

                                <div className="timeline-container">
                                    {['PENDING', 'SHIPPING', 'DELIVERED'].map((step, index) => {
                                        const statuses = ['PENDING', 'SHIPPING', 'DELIVERED'];
                                        const currentIndex = statuses.indexOf(selectedOrder.status);
                                        const isCompleted = currentIndex >= index;
                                        const isCurrent = currentIndex === index;
                                        const labels = ['Đã đóng gói', 'Đang giao hàng', 'Đã giao hàng'];
                                        
                                        return (
                                            <div key={step} className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                                <div className="step-indicator">
                                                    <div className="dot">
                                                        {isCompleted && (
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                        )}
                                                    </div>
                                                    {index < 2 && <div className="line"></div>}
                                                </div>
                                                <div className="step-content">
                                                    <div className="step-label">{labels[index]}</div>
                                                    <div className="step-date">
                                                        {isCompleted ? moment(selectedOrder.updated_at).format('DD/MM, HH:mm') : 'Chờ xử lý...'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="delivery-info">
                                <div className="info-row">
                                    <div className="info-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span>Ngày đặt</span>
                                    </div>
                                    <div className="info-value">{moment(selectedOrder.created_at).format('DD/MM/YYYY')}</div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span>Ngày nhận</span>
                                    </div>
                                    <div className="info-value">
                                        {selectedOrder.status === 'DELIVERED' ? moment(selectedOrder.updated_at).format('DD/MM/YYYY') : 'Chờ xử lý'}
                                    </div>
                                </div>
                                <div className="info-row">
                                    <div className="info-label">
                                        <span className="courier-icon">🚚</span>
                                        <span>Vận chuyển</span>
                                    </div>
                                    <div className="info-value courier-value">
                                        Tiêu chuẩn
                                    </div>
                                </div>
                                <div className="info-row address-row">
                                    <div className="info-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        <span>Địa chỉ</span>
                                    </div>
                                    <div className="info-value">
                                        {selectedOrder.shipping_address}
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary Section */}
                            <div className="summary-section">
                                <h3>Tóm tắt đơn hàng</h3>
                                <div className="summary-box">
                                    <div className="summary-calculations">
                                        <div className="calc-row">
                                            <span>Tạm tính</span>
                                            <span>{Number(selectedOrder.total_price).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                        <div className="calc-row">
                                            <span>Giảm giá</span>
                                            <span>0₫</span>
                                        </div>
                                        <div className="calc-row">
                                            <span>Phí vận chuyển</span>
                                            <span>Miễn phí</span>
                                        </div>
                                        <div className="calc-row total-row">
                                            <span>Tổng cộng</span>
                                            <span className="total-value">{Number(selectedOrder.total_price).toLocaleString('vi-VN')}₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Section */}
                            <div className="items-section">
                                <h3>Sản phẩm ({selectedOrder.order_items.length})</h3>
                                <div className="items-box">
                                    {selectedOrder.order_items.map(item => (
                                        <div key={item.id} className="item-card">
                                            <img src={item.product.image} alt={item.product.name} />
                                            <div className="item-details">
                                                <div className="item-name">{item.product.name}</div>
                                                <div className="item-bottom">
                                                    <span className="item-qty">SL: {item.quantity}</span>
                                                    <span className="item-price">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="btn-download-invoice">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Xuất hóa đơn
                            </button>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default OrderPage;