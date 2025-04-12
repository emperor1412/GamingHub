import React from 'react';
import './TestScreens.css';

/**
 * BadScreen - màn hình có vấn đề overscrolling
 * Màn hình này thiếu các kỹ thuật ngăn chặn overscrolling
 */
const BadScreen = ({ onBack }) => {
  const items = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="test-screen-container bad-screen-container">
      <div className="test-screen-header">
        Màn hình với Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="test-screen-content">
        {items.map((item) => (
          <div key={item} className="test-item">
            <p>Phần tử #{item} - Cuộn lên/xuống để test</p>
          </div>
        ))}
        
        <div className="test-item error-item">
          <p>
            Đây là màn hình BỊ LỖI OVERSCROLLING.<br/><br/>
            Vấn đề: khi cuộn đến cuối trang, màn hình sẽ bị "bounce" hoặc hiện nền phía sau.
            <br/><br/>
            Nguyên nhân:<br/>
            - Sử dụng position: absolute thay vì fixed<br/>
            - Không có overscroll-behavior: none<br/>
            - Không kiểm soát overflow ở body<br/>
            - Không có -webkit-overflow-scrolling: touch<br/>
            - Thiếu touch-action: pan-y
          </p>
        </div>
      </div>
    </div>
  );
};

export default BadScreen; 