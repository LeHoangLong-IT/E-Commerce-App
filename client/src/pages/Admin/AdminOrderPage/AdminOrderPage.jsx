import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, notification, Select, Space } from 'antd';
import orderApi from '../../../api/orderApi';
import moment from 'moment';
import './AdminOrderPage.scss';

const { Option } = Select;

const AdminOrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await orderApi.getAllOrder();
            if (res.status === 'OK') {
                setOrders(res.data);
            } else {
                notification.error({ message: 'Lỗi', description: res.message });
            }
        } catch (error) {
            notification.error({ message: 'Lỗi', description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status, is_paid) => {
        try {
            const res = await orderApi.updateOrderStatus(id, { status, is_paid });
            if (res.status === 'OK') {
                notification.success({ message: 'Cập nhật thành công' });
                fetchOrders();
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(prev => ({ ...prev, status, is_paid }));
                }
            } else {
                notification.error({ message: 'Lỗi', description: res.message });
            }
        } catch (error) {
            notification.error({ message: 'Lỗi', description: error.message });
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
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div>
                    <div>{user?.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{user?.email}</div>
                </div>
            )
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
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 150 }}
                    onChange={(val) => handleUpdateStatus(record.id, val, record.is_paid)}
                >
                    <Option value="PENDING"><Tag color="blue">Chờ xử lý</Tag></Option>
                    <Option value="SHIPPING"><Tag color="orange">Đang giao</Tag></Option>
                    <Option value="DELIVERED"><Tag color="green">Đã giao</Tag></Option>
                    <Option value="CANCELLED"><Tag color="red">Đã hủy</Tag></Option>
                </Select>
            )
        },
        {
            title: 'Thanh Toán',
            dataIndex: 'is_paid',
            key: 'is_paid',
            render: (is_paid, record) => (
                <Select
                    value={is_paid}
                    style={{ width: 140 }}
                    onChange={(val) => handleUpdateStatus(record.id, record.status, val)}
                >
                    <Option value={false}><Tag color="default">Chưa TT</Tag></Option>
                    <Option value={true}><Tag color="green">Đã TT</Tag></Option>
                </Select>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" onClick={() => handleViewDetails(record)}>Chi tiết</Button>
            )
        }
    ];

    return (
        <div className="admin-order-page">
            <h2 className="page-title">Quản lý Đơn hàng</h2>
            
            <Table 
                dataSource={orders} 
                columns={columns} 
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1000 }}
            />

            <Modal 
                title={`Chi tiết đơn hàng #${selectedOrder?.id}`} 
                open={isModalVisible} 
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>Đóng</Button>
                ]}
                width={700}
            >
                {selectedOrder && (
                    <div className="admin-order-modal">
                        <div className="info-grid">
                            <div className="info-block">
                                <h4>Thông tin khách hàng</h4>
                                <p><strong>Tên:</strong> {selectedOrder.user?.name}</p>
                                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                            </div>
                            <div className="info-block">
                                <h4>Giao hàng & Thanh toán</h4>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.shipping_address}</p>
                                <p><strong>Phương thức:</strong> {selectedOrder.payment_method}</p>
                                <p><strong>Ngày đặt:</strong> {moment(selectedOrder.created_at).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                        </div>
                        
                        <h4 className="mt-4">Sản phẩm đã mua</h4>
                        <Table 
                            dataSource={selectedOrder.order_items}
                            rowKey="id"
                            pagination={false}
                            size="small"
                            columns={[
                                {
                                    title: 'Sản phẩm',
                                    key: 'product',
                                    render: (_, item) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={item.product?.image} alt="img" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                                            <span>{item.product?.name}</span>
                                        </div>
                                    )
                                },
                                {
                                    title: 'SL',
                                    dataIndex: 'quantity',
                                    key: 'qty'
                                },
                                {
                                    title: 'Đơn giá',
                                    dataIndex: 'price',
                                    key: 'price',
                                    render: (p) => `${Number(p).toLocaleString('vi-VN')}₫`
                                },
                                {
                                    title: 'Thành tiền',
                                    key: 'total',
                                    render: (_, item) => <strong style={{ color: '#ff424e' }}>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</strong>
                                }
                            ]}
                        />
                        
                        <div className="total-summary">
                            <h2>Tổng tiền: <span style={{ color: '#ff424e' }}>{Number(selectedOrder.total_price).toLocaleString('vi-VN')}₫</span></h2>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AdminOrderPage;
