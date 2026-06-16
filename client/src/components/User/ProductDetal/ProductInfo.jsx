import React from 'react';
import { Rate } from 'antd';

const ProductInfo = ({ product }) => {
  const price = Number(product?.price) || 0;
  const salePrice = Number(product?.sale_price) || 0;
  const discountPercent = price > 0 ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <div className="whiteBox">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <span style={{ color: '#0b74e5', fontWeight: 500, fontSize: '13px' }}>Thương hiệu: {product?.type || "Chưa cập nhật"}</span>
      </div>
      <h1 style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 8px 0', lineHeight: '28px' }}>
        {product?.name || "Tên sản phẩm"}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px' }}>
        <span>{product?.rating || "0.0"}</span>
        <Rate disabled defaultValue={Number(product?.rating) || 5} style={{ fontSize: '12px', color: '#fdd835' }} />
        <span style={{ color: 'var(--textSecondary)' }}>(1) | Đã bán {product?.sold || 0}</span>
      </div>
      <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--textSecondary)' }}>
        Tình trạng: {product?.count_in_stock > 0 ? "Còn hàng" : "Hết hàng"}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '12px 16px', backgroundColor: 'var(--bgSoft)', borderRadius: '4px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px', fontWeight: 500, color: '#ff424e', lineHeight: '32px' }}>
          {salePrice.toLocaleString('vi-VN')} ₫
        </span>
        {price > salePrice && (
          <>
            <span style={{ fontSize: '14px', color: 'var(--textSecondary)', textDecoration: 'line-through', marginBottom: '4px' }}>
              {price.toLocaleString('vi-VN')} ₫
            </span>
            <span style={{ fontSize: '14px', color: '#ff424e', fontWeight: 500, marginBottom: '4px' }}>-{discountPercent}%</span>
          </>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: 500 }}>Mô tả sản phẩm</div>
        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          {product?.description || "Chưa có mô tả cho sản phẩm này."}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
