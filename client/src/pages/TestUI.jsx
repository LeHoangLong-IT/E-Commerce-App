import React from 'react';
import moment from 'moment';
import '../pages/User/OrderPage/OrderPage.scss'; // Import order page styles

const mockOrder = {
    id: 1234,
    status: 'SHIPPING',
    created_at: new Date('2023-09-24T12:00:00'),
    updated_at: new Date('2023-09-26T14:30:00'),
    shipping_address: 'No 4, Goodwood St, London, UK',
    phone: '0987654321',
    payment_method: 'COD',
    total_price: 500.56,
    order_items: [
        {
            id: 1,
            product: { name: 'iPhone 15 Pro Max Black Titanium, 256GB', image: 'https://via.placeholder.com/64' },
            quantity: 1,
            price: 400
        }
    ]
};

const TestUI = () => {
    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px', display: 'flex', justifyContent: 'center' }}>
            <div className="beautiful-order-modal" style={{ width: '100%', maxWidth: '800px' }}>
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
                                <h2 className="order-id">Đơn hàng #{mockOrder.id}</h2>
                                <div className={`status-badge status-${mockOrder.status.toLowerCase()}`}>Đang giao</div>
                            </div>
                        </div>
                        <div className="header-right">
                            <button className="btn-action">Theo dõi</button>
                            <button className="btn-icon">
                                <svg className="icon-pc" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                <svg className="icon-mobile" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                        </div>
                    </div>

                    {/* Tracking Section */}
                    <div className="tracking-section">
                        <div className="tracking-subtitle">
                            <span>Đang giao hàng</span>
                            <span className="est-time">Dự kiến: 3 ngày</span>
                        </div>

                        <div className="timeline-container">
                            {['PENDING', 'SHIPPING', 'DELIVERED'].map((step, index) => {
                                const statuses = ['PENDING', 'SHIPPING', 'DELIVERED'];
                                const currentIndex = statuses.indexOf(mockOrder.status);
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
                                                {isCompleted ? moment(mockOrder.updated_at).format('DD/MM, HH:mm') : 'Chờ xử lý...'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Delivery Info Section */}
                    <div className="delivery-info">
                        <div className="info-row">
                            <div className="info-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>Ngày đặt</span>
                            </div>
                            <div className="info-value">{moment(mockOrder.created_at).format('DD/MM/YYYY')}</div>
                        </div>
                        <div className="info-row">
                            <div className="info-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                <span>Ngày nhận</span>
                            </div>
                            <div className="info-value">
                                {mockOrder.status === 'DELIVERED' ? moment(mockOrder.updated_at).format('DD/MM/YYYY') : 'Chờ xử lý'}
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
                                {mockOrder.shipping_address}
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
                                    <span>{Number(mockOrder.total_price).toLocaleString('vi-VN')}₫</span>
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
                                    <span className="total-value">{Number(mockOrder.total_price).toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="items-section">
                        <h3>Sản phẩm ({mockOrder.order_items.length})</h3>
                        <div className="items-box">
                            {mockOrder.order_items.map(item => (
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
            </div>
        </div>
    );
};

export default TestUI;
