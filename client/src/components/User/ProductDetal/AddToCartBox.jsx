import React, { useState } from 'react';
import { Button, InputNumber } from 'antd';

const AddToCartBox = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const salePrice = Number(product?.sale_price) || 0;
  const totalPrice = salePrice * quantity;

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
        <Button disabled={product?.count_in_stock <= 0} style={{ height: '40px', fontSize: '15px', fontWeight: 500, color: '#0b74e5', borderColor: '#0b74e5', borderRadius: '4px' }}>
          Thêm vào giỏ
        </Button>
      </div>
    </div>
  );
};

export default AddToCartBox;
