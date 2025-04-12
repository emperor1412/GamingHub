import React from 'react';
import './TestScreens.css';

/**
 * ShortContentScreen - màn hình có ít nội dung nhưng vẫn bị lỗi overscrolling
 * Màn hình này minh họa vấn đề khi trang không đủ nội dung để tạo thanh cuộn
 * nhưng người dùng vẫn có thể kéo/vuốt và gây ra hiện tượng overscrolling
 */
const ShortContentScreen = ({ onBack }) => {
  return (
    <div className="test-screen-container short-screen-container">
      <div className="test-screen-header">
        Nội dung ngắn vẫn bị Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="test-screen-content">
        <div className="test-item" style={{ background: 'rgba(255, 165, 0, 0.1)', minHeight: '150px' }}>
          <p>
            Đây là một màn hình có nội dung ngắn.<br/><br/>
            Thử kéo/vuốt lên xuống và bạn sẽ thấy vấn đề overscrolling vẫn xảy ra.
          </p>
        </div>
        
        <div className="test-item" style={{ marginTop: '15px', background: 'rgba(255, 165, 0, 0.2)' }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Vấn đề:</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '0' }}>
              <li>Màn hình có ít nội dung nhưng vẫn có thể cuộn</li>
              <li>Khi vuốt/kéo, hiệu ứng "bounce" hoặc kéo nền vẫn xảy ra</li>
              <li>Có thể kéo màn hình ra ngoài ranh giới</li>
              <li>Tạo cảm giác ứng dụng không mượt mà</li>
            </ul>
          </div>
        </div>
        
        {/* Phần tử cuối đảm bảo không bị tràn */}
        <div className="test-item" style={{ 
          marginTop: '15px', 
          background: 'rgba(255, 165, 0, 0.15)',
          marginBottom: '20px'
        }}>
          <p style={{ margin: '0' }}>
            Thử cuộn từ đây đến cuối và kéo tiếp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortContentScreen; 