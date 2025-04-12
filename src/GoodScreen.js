import React, { useEffect } from 'react';
import './TestScreens.css';

/**
 * GoodScreen - màn hình đã khắc phục vấn đề overscrolling
 * Màn hình này áp dụng tất cả các kỹ thuật để ngăn chặn overscrolling
 */
const GoodScreen = ({ onBack }) => {
  const items = Array.from({ length: 20 }, (_, i) => i + 1);

  // Add body class to control overscrolling at body level
  useEffect(() => {
    document.body.classList.add('no-overscroll');
    return () => {
      document.body.classList.remove('no-overscroll');
    };
  }, []);

  return (
    <div className="test-screen-container good-screen-container">
      <div className="test-screen-header">
        Màn hình đã fix Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="good-screen-content hide-scrollbar">
        {items.map((item) => (
          <div key={item} className="test-item">
            <p>Phần tử #{item} - Cuộn lên/xuống để test</p>
          </div>
        ))}
        
        <div className="test-item success-item">
          <p>
            Đây là màn hình ĐÃ FIX LỖI OVERSCROLLING.<br/><br/>
            Cải tiến:<br/>
            - Sử dụng position: fixed thay vì absolute<br/>
            - Áp dụng overscroll-behavior: none<br/>
            - Thêm class kiểm soát overflow ở body<br/>
            - Có -webkit-overflow-scrolling: touch<br/>
            - Thêm touch-action: pan-y<br/>
            - Ẩn thanh cuộn nhưng vẫn giữ chức năng cuộn
          </p>
        </div>
        
        <div className="test-item last-item">
          <p>
            Phần tử cuối cùng - với padding-bottom đủ lớn để không bị che khuất.<br/><br/>
            Phần này sẽ luôn hiển thị đầy đủ và không bị cut-off ở dưới cùng.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoodScreen; 