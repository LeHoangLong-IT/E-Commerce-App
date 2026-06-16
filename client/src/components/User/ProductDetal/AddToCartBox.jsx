import React, { useState } from 'react';
import { Button, InputNumber, notification } from 'antd';
import cartApi from '../../../api/cartApi';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, CheckCircleFilled } from '@ant-design/icons';

const AddToCartBox = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const salePrice = Number(product?.sale_price) || 0;
  const totalPrice = salePrice * quantity;
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        notification.warning({ message: 'Vui lòng đăng nhập để thêm vào giỏ hàng' });
        navigate('/sign-in');
        return;
      }
      const res = await cartApi.addToCart({
        productId: product.id,
        quantity: quantity
      });
      if (res.status === 'OK') {
        notification.open({ 
            message: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52c41a' }}>
                        <CheckCircleFilled style={{ fontSize: '20px' }} />
                        <span style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Thêm vào giỏ hàng thành công</span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img src={product.image} alt={product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #f0f0f0', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 500, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {product.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <span style={{ fontSize: '13px', color: '#888' }}>x{quantity}</span>
                                <span style={{ color: '#ee4d2d', fontWeight: 'bold', fontSize: '16px' }}>
                                    {(salePrice * quantity).toLocaleString("vi-VN")}₫
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            duration: 3,
            style: { width: 380, padding: '16px' }
        });
      } else {
        notification.error({ message: res.message || 'Có lỗi xảy ra' });
      }
    } catch (error) {
       notification.error({ message: error.response?.data?.message || 'Có lỗi xảy ra' });
    }
  };

  return (
    <div className="whiteBox">
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Số Lượng</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          <Button 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '4px 0 0 4px' }}
          >
            -
          </Button>
          <InputNumber 
            min={1} 
            max={product?.count_in_stock || 1}
            value={quantity} 
            onChange={(val) => setQuantity(val || 1)}
            style={{ width: '40px', height: '32px', borderRadius: '0', textAlign: 'center' }} 
            controls={false} 
          />
          <Button 
            onClick={() => setQuantity(q => Math.min(product?.count_in_stock || 1, q + 1))}
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '0 4px 4px 0' }}
          >
            +
          </Button>
        </div>
        <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--textSecondary)' }}>
          Còn lại {product?.count_in_stock || 0} sản phẩm
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Tạm tính</div>
        <div style={{ fontSize: '24px', fontWeight: 500 }}>{totalPrice.toLocaleString('vi-VN')} ₫</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Button disabled={product?.count_in_stock <= 0} type="primary" danger style={{ height: '40px', fontSize: '15px', fontWeight: 500, borderRadius: '4px' }}>
          Mua ngay
        </Button>
        <Button disabled={product?.count_in_stock <= 0} style={{ height: '40px', fontSize: '15px', fontWeight: 500, color: '#0b74e5', borderColor: '#0b74e5', borderRadius: '4px' }} onClick={handleAddToCart}>
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default AddToCartBox;
