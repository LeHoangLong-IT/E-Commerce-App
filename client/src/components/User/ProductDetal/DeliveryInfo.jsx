import React from 'react';

const DeliveryInfo = () => {
  return (
    <div className="whiteBox">
      <h3 style={{ fontSize: '16px', fontWeight: 500, margin: '0 0 12px 0' }}>Thông tin vận chuyển</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
        <span style={{ color: 'var(--textColor)' }}>Giao đến Q. 1, P. Bến Nghé, Hồ Chí Minh</span>
        <span style={{ color: '#0b74e5', cursor: 'pointer', fontWeight: 500 }}>Đổi</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', borderBottom: '1px solid var(--borderColor)', paddingBottom: '12px', marginBottom: '12px' }}>
        <img src="https://salt.tikicdn.com/ts/upload/5e/1e/8a/75db5a1dc3aefb5821034f135b5a0fb7.png" alt="truck" style={{ width: '20px' }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>Giao Thứ Năm</div>
          <div style={{ fontSize: '13px', color: 'var(--textSecondary)' }}>Ngày 18/06: <span style={{ color: '#00ab56', fontWeight: 500 }}>Miễn phí</span> <span style={{ textDecoration: 'line-through' }}>14.000 ₫</span></div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
          <img src="https://salt.tikicdn.com/ts/upload/21/b3/0f/bbfaec9ac83bb111dc5a259c1b894dc0.png" alt="Freeship Xtra" style={{ height: '16px' }} />
        </div>
        <div style={{ fontSize: '13px', color: 'var(--textSecondary)' }}>
          Freeship 15k đơn từ 45k, Freeship 30k đơn từ 100k
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
