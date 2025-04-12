import React, { useState, useEffect } from 'react';
import './TestScreens.css';

/**
 * GoodPopupScreen - màn hình có popup đã khắc phục vấn đề overscrolling
 * Minh họa cách khắc phục vấn đề overscrolling khi sử dụng popup modal
 */
const GoodPopupScreen = ({ onBack }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  // Control body class when showing popup
  useEffect(() => {
    if (showPopup) {
      document.body.classList.add('popup-open');
    } else {
      document.body.classList.remove('popup-open');
    }
    
    return () => {
      document.body.classList.remove('popup-open');
    };
  }, [showPopup]);
  
  // Add class to control overscrolling at body level
  useEffect(() => {
    document.body.classList.add('no-overscroll');
    
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
        
        <div className="test-item success-item">
          <button className="popup-trigger-button" onClick={togglePopup}>
            Mở Popup Đã Fix
          </button>
        </div>
        
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
              <div className="popup-item success-popup-item">
                <div className="solution-content">
                  <p>Giải pháp:</p>
                  <ul className="solution-list">
                    <li>Thêm class cho body khi popup hiển thị</li>
                    <li>Sử dụng position: fixed cho overlay</li>
                    <li>Áp dụng overscroll-behavior: none cho popup</li>
                    <li>Sử dụng -webkit-overflow-scrolling: touch</li>
                    <li>Đủ padding cho phần tử cuối cùng</li>
                    <li>Đặt max-height và chỉ cho phép cuộn nội dung popup</li>
                  </ul>
                </div>
              </div>
              <div className="popup-item-spacer"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoodPopupScreen; 