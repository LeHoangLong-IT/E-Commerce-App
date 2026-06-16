import React from 'react';

const SellerInfo = () => {
  return (
    <div className="whiteBox">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="https://vcdn.tikicdn.com/cache/w100/ts/seller/2a/39/b5/e88e2c3da72d3f66850cfad4197e3a9a.jpg" 
          alt="Nhà sách Fahasa" 
          style={{ width: '44px', height: '44px', borderRadius: '50%' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontWeight: 500, fontSize: '15px' }}>Nhà sách Fahasa</span>
            <img src="https://salt.tikicdn.com/cache/w100/ts/upload/5d/4c/f7/0261315e75127c2ff73efd7a1f1fffd2.png" alt="Official" style={{ height: '16px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginTop: '4px' }}>
            <span style={{ fontWeight: 500 }}>4.8</span>
            <span style={{ color: '#fdd835' }}>★</span>
            <span style={{ color: 'var(--textSecondary)' }}>(423k+ đánh giá)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
