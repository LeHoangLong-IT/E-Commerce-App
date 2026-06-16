import React from 'react';

const ProductImageGallery = ({ product }) => {
  const mainImg = product?.image || "https://salt.tikicdn.com/cache/750x750/ts/product/6e/89/a3/941e171328ea4e414f6b3e36e1b6df70.png";
  return (
    <div className="whiteBox" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img 
        src={mainImg} 
        alt={product?.name || "Product image"}
        style={{ width: '100%', maxWidth: '350px', objectFit: 'contain', marginBottom: '16px' }}
      />
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', width: '100%' }}>
        {product?.images && product.images.length > 0 ? (
          product.images.map((img, index) => (
            <img key={index} src={img} alt={`thumb-${index}`} style={{ width: '50px', height: '50px', border: index === 0 ? '1px solid #1890ff' : '1px solid #e5e5e5', borderRadius: '4px', padding: '4px' }} />
          ))
        ) : (
           <img src={mainImg} alt="thumb1" style={{ width: '50px', height: '50px', border: '1px solid #1890ff', borderRadius: '4px', padding: '4px' }} />
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;
