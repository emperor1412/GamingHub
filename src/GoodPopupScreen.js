import React, { useState, useEffect } from 'react';
import './TestScreens.css';

/**
 * GoodPopupScreen - màn hình có popup đã khắc phục vấn đề overscrolling
 * Minh họa cách khắc phục vấn đề overscrolling khi sử dụng popup modal
 */
const GoodPopupScreen = ({ onBack }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  // Điều khiển body khi hiển thị popup
  useEffect(() => {
    if (showPopup) {
      // Thêm class khi hiển thị popup
      document.body.classList.add('popup-open');
    } else {
      // Xóa class khi đóng popup
      document.body.classList.remove('popup-open');
    }
    
    // Cleanup khi component unmount
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [showPopup]);
  
  // Thêm class để kiểm soát overscrolling ở cấp body
  useEffect(() => {
    // Thêm class khi component được mount
    document.body.classList.add('no-overscroll');
    
    // Xóa class khi component unmount
    return () => {
      document.body.classList.remove('no-overscroll');
    };
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="test-screen-container good-screen-container">
      <div className="test-screen-header">
        Popup đã fix Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="good-screen-content">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="test-item">
            <p>Phần tử #{i + 1} - Nội dung nền</p>
          </div>
        ))}
        
        <div className="test-item" style={{ background: 'rgba(0, 255, 0, 0.1)' }}>
          <button 
            onClick={togglePopup}
            style={{
              padding: '15px 30px',
              background: 'rgba(0, 255, 0, 0.3)',
              border: '1px solid #00FF00',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Mở Popup Đã Fix
          </button>
        </div>
        
        {/* Phần tử cuối cùng với padding đủ lớn để không bị che khuất */}
        <div className="test-item last-item">
          <p>Phần tử cuối cùng - không bị che khuất</p>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay good-popup">
          <div className="popup-content">
            <button className="popup-close" onClick={togglePopup}>×</button>
            <h2>Popup đã fix Overscrolling</h2>
            <p className="popup-description">
              Đây là popup đã khắc phục vấn đề overscrolling.<br/>
              Thử cuộn xuống và kéo/vuốt - bạn sẽ thấy không còn hiệu ứng "bounce".
            </p>
            <div className="popup-items">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="popup-item">
                  <p>Phần tử Popup #{i + 1}</p>
                </div>
              ))}
              <div className="popup-item" style={{ background: 'rgba(0, 255, 0, 0.2)' }}>
                <div>
                  <p>Giải pháp:</p>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    <li>Thêm class cho body khi popup hiển thị</li>
                    <li>Sử dụng position: fixed cho overlay</li>
                    <li>Áp dụng overscroll-behavior: none cho popup</li>
                    <li>Sử dụng -webkit-overflow-scrolling: touch</li>
                    <li>Đủ padding cho phần tử cuối cùng</li>
                    <li>Đặt max-height và chỉ cho phép cuộn nội dung popup</li>
                  </ul>
                </div>
              </div>
              {/* Đảm bảo có đủ không gian dưới cùng để tránh bị che khuất */}
              <div className="popup-item-spacer"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodPopupScreen; 