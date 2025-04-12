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
        <div className="test-item" style={{ height: '200px', background: 'rgba(255, 165, 0, 0.1)' }}>
          <p>
            Đây là một màn hình có rất ít nội dung, không đủ để tạo thanh cuộn.<br/><br/>
            Thử kéo/vuốt lên xuống và bạn sẽ thấy vấn đề overscrolling vẫn xảy ra.<br/><br/>
            Điều này đặc biệt phổ biến trên thiết bị di động.
          </p>
        </div>
        
        <div className="test-item" style={{ marginTop: '30px', background: 'rgba(255, 165, 0, 0.2)' }}>
          <div>
            <p>Vấn đề:</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>Màn hình có ít nội dung không cần cuộn</li>
              <li>Người dùng vẫn có thể kéo/vuốt màn hình</li>
              <li>Khi vuốt, hiệu ứng "bounce" hoặc kéo nền vẫn xảy ra</li>
              <li>Tạo cảm giác ứng dụng không mượt mà</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortContentScreen; 