import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, notification, Spin, Row, Col, Modal, Select, Upload } from 'antd';
import { 
    User, Mail, Phone, MapPin, Calendar, Edit, 
    ShoppingBag, Heart, Star, Navigation, 
    Lock, Shield, MonitorSmartphone, ChevronRight, Camera,
    CheckCircle2
} from 'lucide-react';
import moment from 'moment';
import userApi from '../../../api/userApi';
import orderApi from '../../../api/orderApi';
import './ProfilePage.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    
    // Modal states
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        fetchProvinces();
    }, []);

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

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notification.error({ message: 'Bạn chỉ có thể tải lên file JPG/PNG!' });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.error({ message: 'Kích thước ảnh phải nhỏ hơn 2MB!' });
        }
        return isJpgOrPng && isLt2M;
    };

    const handleUploadChange = async (info) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done' || info.file.originFileObj) {
            const base64 = await getBase64(info.file.originFileObj || info.file);
            setImageUrl(base64);
            form.setFieldsValue({ avatar: base64 });
        }
    };

    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const currentUserStr = localStorage.getItem('user');
            if (!currentUserStr) {
                navigate('/sign-in');
                return;
            }
            
            const currentUser = JSON.parse(currentUserStr);
            const res = await userApi.getDetail(currentUser.id);
            
            if (res) {
                setUser(res);
                form.setFieldsValue({
                    name: res.name,
                    email: res.email,
                    phone: res.phone,
                    address: res.address,
                    gender: res.gender || 'MALE',
                    date_of_birth: res.date_of_birth ? moment(res.date_of_birth) : null,
                    avatar: res.avatar
                });
                setImageUrl(res.avatar);
                
                localStorage.setItem('user', JSON.stringify({
                    id: res.id,
                    name: res.name,
                    email: res.email,
                    role: res.role,
                    phone: res.phone,
                    address: res.address,
                    gender: res.gender,
                    date_of_birth: res.date_of_birth,
                    avatar: res.avatar
                }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await orderApi.getAllOrderDetails();
            if (res && res.data) {
                setOrders(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    const handleUpdateProfile = async (values) => {
        try {
            setSaving(true);
            
            let fullAddress = user?.address; // Default to old address
            if (values.province && values.district && values.ward && values.street_address) {
                const provinceName = provinces.find(p => p.code === values.province)?.name || '';
                const districtName = districts.find(d => d.code === values.district)?.name || '';
                const wardName = wards.find(w => w.code === values.ward)?.name || '';
                fullAddress = `${values.street_address}, ${wardName}, ${districtName}, ${provinceName}`;
            } else if (values.street_address || values.province || values.district || values.ward) {
                if (!(values.province && values.district && values.ward && values.street_address)) {
                    notification.warning({ message: 'Vui lòng điền đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã và Số nhà nếu bạn muốn thay đổi địa chỉ.' });
                    setSaving(false);
                    return;
                }
            }

            const updateData = {
                ...values,
                address: fullAddress,
                date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString() : null
            };
            
            delete updateData.province;
            delete updateData.district;
            delete updateData.ward;
            delete updateData.street_address;
            
            await userApi.update(user.id, updateData);
            
            notification.success({ 
                message: 'Cập nhật thành công',
                description: 'Thông tin cá nhân của bạn đã được lưu lại.'
            });
            
            setIsEditModalVisible(false);
            fetchUserData();
        } catch (error) {
            notification.error({ message: 'Có lỗi xảy ra', description: error.message });
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return 'badge-green';
            case 'SHIPPED': return 'badge-blue';
            case 'PROCESSING': return 'badge-purple';
            case 'CANCELLED': return 'badge-red';
            default: return 'badge-gray';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toUpperCase()) {
            case 'DELIVERED': return 'Đã giao';
            case 'SHIPPED': return 'Đang giao';
            case 'PROCESSING': return 'Đang xử lý';
            case 'CANCELLED': return 'Đã hủy';
            case 'PENDING': return 'Chờ xử lý';
            default: return status || 'Chờ xử lý';
        }
    };

    if (loading && !user) {
        return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}><Spin size="large" /></div>;
    }

    return (
        <div className="modern-profile-page">
            {/* Mobile Header Background */}
            <div className="mobile-header-bg">
                <h2 className="mobile-title">Hồ sơ của tôi</h2>
            </div>

            <div className="profile-container">
                <div className="page-header d-none d-md-block">
                    <h2>Hồ sơ của tôi</h2>
                    <p>Quản lý thông tin cá nhân và cài đặt tài khoản</p>
                </div>

                {/* Top Section */}
                <div className="top-section">
                    <div className="avatar-card">
                        <div className="avatar-wrapper">
                            <img 
                                src={user?.avatar || "https://i.pravatar.cc/300"} 
                                alt="avatar" 
                                className="avatar-img"
                            />
                            <div className="camera-btn"><Camera size={16} /></div>
                        </div>
                        <h3>{user?.name} <CheckCircle2 size={18} className="verified-icon" /></h3>
                        <span className="role">{user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên Premium'}</span>
                        <span className="member-since">Thành viên từ {user?.created_at ? moment(user?.created_at).format('MMM YYYY') : 'Thg 1 2023'}</span>
                    </div>

                    <div className="personal-info-card">
                        <div className="card-header">
                            <h3>Thông tin cá nhân</h3>
                            <div className="edit-link" onClick={() => setIsEditModalVisible(true)}>
                                Chỉnh sửa <Edit size={14} className="ms-1" />
                            </div>
                        </div>
                        <div className="info-list">
                            <div className="info-row">
                                <div className="info-label"><User size={16} /> <span>Họ và tên</span></div>
                                <div className="info-value">{user?.name}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label"><Mail size={16} /> <span>Địa chỉ Email</span></div>
                                <div className="info-value">{user?.email}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label"><Phone size={16} /> <span>Số điện thoại</span></div>
                                <div className="info-value">{user?.phone || 'Chưa thiết lập'}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label"><Calendar size={16} /> <span>Ngày sinh</span></div>
                                <div className="info-value">{user?.date_of_birth ? moment(user?.date_of_birth).format('DD/MM/YYYY') : 'Chưa thiết lập'}</div>
                            </div>
                            <div className="info-row">
                                <div className="info-label"><User size={16} /> <span>Giới tính</span></div>
                                <div className="info-value">
                                    {user?.gender === 'MALE' ? 'Nam' : user?.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                                </div>
                            </div>
                            <div className="info-row">
                                <div className="info-label"><MapPin size={16} /> <span>Địa chỉ</span></div>
                                <div className="info-value" title={user?.address}>{user?.address || 'Chưa thiết lập'}</div>
                            </div>
                        </div>
                        <Button 
                            className="mobile-edit-btn" 
                            type="primary"
                            onClick={() => setIsEditModalVisible(true)}
                        >
                            Chỉnh sửa hồ sơ
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-card purple">
                        <div className="stat-icon-wrapper"><ShoppingBag size={24} /></div>
                        <div className="stat-info">
                            <h4>{orders.length}</h4>
                            <p>Đơn hàng</p>
                        </div>
                        <div className="stat-link" onClick={() => navigate('/my-orders')}>Xem tất cả đơn hàng <ChevronRight size={14} /></div>
                    </div>
                    
                    <div className="stat-card green">
                        <div className="stat-icon-wrapper"><Heart size={24} /></div>
                        <div className="stat-info">
                            <h4>12</h4>
                            <p>Yêu thích</p>
                        </div>
                        <div className="stat-link">Xem danh sách yêu thích <ChevronRight size={14} /></div>
                    </div>
                    
                    <div className="stat-card yellow">
                        <div className="stat-icon-wrapper"><Star size={24} /></div>
                        <div className="stat-info">
                            <h4>8</h4>
                            <p>Đánh giá</p>
                        </div>
                        <div className="stat-link">Xem tất cả đánh giá <ChevronRight size={14} /></div>
                    </div>
                    
                    <div className="stat-card blue">
                        <div className="stat-icon-wrapper"><Navigation size={24} /></div>
                        <div className="stat-info">
                            <h4>3</h4>
                            <p>Địa chỉ</p>
                        </div>
                        <div className="stat-link">Quản lý địa chỉ <ChevronRight size={14} /></div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="bottom-section">
                    <div className="recent-orders-card">
                        <div className="card-header">
                            <h3>Đơn hàng gần đây</h3>
                            <span className="view-all-link" onClick={() => navigate('/my-orders')}>Xem tất cả</span>
                        </div>
                        
                        <div className="orders-list">
                            {orders.slice(0, 3).map(order => (
                                <div className="order-item" key={order.id}>
                                    <div className="order-img-wrapper">
                                        {order.order_items?.[0]?.product?.image ? (
                                            <img src={order.order_items[0].product.image} alt="product" />
                                        ) : (
                                            <ShoppingBag className="fallback-icon" />
                                        )}
                                    </div>
                                    <div className="order-details">
                                        <h5>{order.order_items?.[0]?.product?.name || `Đơn hàng #${order.id}`}</h5>
                                        <p>Đơn hàng #${order.id} • {moment(order.created_at).format('DD/MM/YYYY')}</p>
                                    </div>
                                    <div className="order-price-status">
                                        <div className="price">{Number(order.total_price).toLocaleString('vi-VN')} ₫</div>
                                        <div className={`status-badge ${getStatusColor(order.status)}`}>
                                            {getStatusText(order.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <div className="no-data">Không tìm thấy đơn hàng gần đây</div>
                            )}
                        </div>
                        
                        <div className="mobile-view-all" onClick={() => navigate('/my-orders')}>
                            Xem tất cả đơn hàng <ChevronRight size={16} />
                        </div>
                    </div>

                    <div className="security-card">
                        <div className="card-header">
                            <h3>Bảo mật tài khoản</h3>
                        </div>
                        
                        <div className="security-list">
                            <div className="security-item">
                                <div className="sec-left">
                                    <Lock size={20} className="sec-icon" />
                                    <div className="sec-info">
                                        <h4>Mật khẩu</h4>
                                        <p>••••••••</p>
                                    </div>
                                </div>
                                <div className="sec-right">
                                    <span className="sec-action-link">Thay đổi</span>
                                </div>
                            </div>
                            
                            <div className="security-item">
                                <div className="sec-left">
                                    <Shield size={20} className="sec-icon" />
                                    <div className="sec-info">
                                        <h4>Xác thực hai yếu tố</h4>
                                    </div>
                                </div>
                                <div className="sec-right">
                                    <span className="sec-status enabled">Đã bật</span>
                                </div>
                            </div>
                            
                            <div className="security-item">
                                <div className="sec-left">
                                    <MonitorSmartphone size={20} className="sec-icon" />
                                    <div className="sec-info">
                                        <h4>Phiên đăng nhập</h4>
                                        <p>3 phiên đang hoạt động</p>
                                    </div>
                                </div>
                                <div className="sec-right">
                                    <ChevronRight size={20} className="arrow-icon" />
                                </div>
                            </div>
                        </div>
                        
                        <Button className="sign-out-all-btn" danger>
                            Đăng xuất khỏi tất cả thiết bị
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                width={700}
                className="edit-profile-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProfile}
                    className="mt-4"
                >
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Ảnh đại diện" name="avatar" className="d-flex flex-column align-items-center">
                                <Upload
                                    name="avatar"
                                    listType="picture-circle"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    onChange={handleUploadChange}
                                    customRequest={customRequest}
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        <div className="d-flex flex-column align-items-center justify-content-center text-muted">
                                            <Camera size={24} />
                                            <div style={{ marginTop: 8 }}>Tải lên</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item label="Địa chỉ Email" name="email">
                                <Input size="large" disabled />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Số điện thoại" name="phone">
                                <Input size="large" />
                            </Form.Item>
                            <Form.Item label="Giới tính" name="gender">
                                <Select size="large">
                                    <Select.Option value="MALE">Nam</Select.Option>
                                    <Select.Option value="FEMALE">Nữ</Select.Option>
                                    <Select.Option value="OTHER">Khác</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="Ngày sinh" name="date_of_birth">
                                <DatePicker size="large" format="DD/MM/YYYY" style={{ width: '100%' }} />
                            </Form.Item>
                            
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: '14px', marginBottom: '8px' }}>Vị trí / Địa chỉ</div>
                                {user?.address && <div style={{ marginBottom: 8, color: '#666', fontSize: '13px' }}>Hiện tại: {user?.address}</div>}
                                
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Form.Item name="province" style={{ flex: 1, marginBottom: 8 }}>
                                        <Select size="large" placeholder="Tỉnh / Thành" onChange={handleProvinceChange} showSearch optionFilterProp="children">
                                            {provinces.map(p => <Select.Option key={p.code} value={p.code}>{p.name}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item name="district" style={{ flex: 1, marginBottom: 8 }}>
                                        <Select size="large" placeholder="Quận / Huyện" onChange={handleDistrictChange} showSearch optionFilterProp="children" disabled={!districts.length}>
                                            {districts.map(d => <Select.Option key={d.code} value={d.code}>{d.name}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Form.Item name="ward" style={{ flex: 1, marginBottom: 8 }}>
                                        <Select size="large" placeholder="Phường / Xã" showSearch optionFilterProp="children" disabled={!wards.length}>
                                            {wards.map(w => <Select.Option key={w.code} value={w.code}>{w.name}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <Form.Item name="street_address" style={{ marginBottom: 0 }}>
                                    <Input size="large" placeholder="Số nhà, tên đường..." />
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button size="large" onClick={() => setIsEditModalVisible(false)}>Hủy</Button>
                        <Button type="primary" htmlType="submit" size="large" loading={saving}>Lưu thay đổi</Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfilePage;
