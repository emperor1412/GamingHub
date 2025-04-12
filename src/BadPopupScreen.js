import React, { useState } from 'react';
import './TestScreens.css';

/**
 * BadPopupScreen - màn hình có popup bị lỗi overscrolling
 * Minh họa vấn đề overscrolling khi sử dụng popup modal
 */
const BadPopupScreen = ({ onBack }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="test-screen-container bad-screen-container">
      <div className="test-screen-header">
        Popup có vấn đề Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="test-screen-content">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="test-item">
            <p>Phần tử #{i + 1} - Nội dung nền</p>
          </div>
        ))}
        
        <div className="test-item" style={{ background: 'rgba(255, 0, 0, 0.1)' }}>
          <button 
            onClick={togglePopup}
            style={{
              padding: '15px 30px',
              background: 'rgba(255, 0, 0, 0.3)',
              border: '1px solid #FF0000',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Mở Popup Lỗi
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay bad-popup">
          <div className="popup-content">
            <button className="popup-close" onClick={togglePopup}>×</button>
            <h2>Popup có vấn đề Overscrolling</h2>
            <p className="popup-description">
              Đây là popup chưa khắc phục vấn đề overscrolling.<br/>
              Thử cuộn xuống và kéo/vuốt vượt quá ranh giới.
            </p>
            <div className="popup-items">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="popup-item">
                  <p>Phần tử Popup #{i + 1}</p>
                </div>
              ))}
              <div className="popup-item" style={{ background: 'rgba(255, 0, 0, 0.2)' }}>
                <div>
                  <p>Vấn đề:</p>
                  <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    <li>Popup vẫn cho phép cuộn màn hình nền</li>
                    <li>Overscrolling xảy ra trong cả popup và nền</li>
                    <li>Hiệu ứng "bounce" làm gián đoạn trải nghiệm</li>
                    <li>Không đủ padding ở cuối làm nội dung bị cắt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadPopupScreen; 