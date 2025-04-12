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
        <div className="test-item large-item warning-item">
          <p>
            Đây là một màn hình có nội dung ngắn.<br/><br/>
            Thử kéo/vuốt lên xuống và bạn sẽ thấy vấn đề overscrolling vẫn xảy ra.
          </p>
        </div>
        
        <div className="test-item warning-item-alt">
          <div className="warning-content">
            <p className="warning-title">Vấn đề:</p>
            <ul className="warning-list">
              <li>Màn hình có ít nội dung nhưng vẫn có thể cuộn</li>
              <li>Khi vuốt/kéo, hiệu ứng "bounce" hoặc kéo nền vẫn xảy ra</li>
              <li>Có thể kéo màn hình ra ngoài ranh giới</li>
              <li>Tạo cảm giác ứng dụng không mượt mà</li>
            </ul>
          </div>
        </div>
        
        <div className="test-item warning-item-light last-short-item">
          <p>
            Thử cuộn từ đây đến cuối và kéo tiếp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortContentScreen; 