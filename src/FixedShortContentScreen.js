import React, { useEffect } from 'react';
import './TestScreens.css';

/**
 * FixedShortContentScreen - màn hình có ít nội dung đã khắc phục lỗi overscrolling
 * Màn hình này minh họa cách khắc phục vấn đề khi trang không đủ nội dung để tạo thanh cuộn
 */
const FixedShortContentScreen = ({ onBack }) => {
  // Thêm class để điều khiển overscrolling ở cấp body
  useEffect(() => {
    // Thêm class khi component được mount
    document.body.classList.add('no-overscroll');
    
    // Xóa class khi component unmount
    return () => {
      document.body.classList.remove('no-overscroll');
    };
  }, []);

  return (
    <div className="test-screen-container fixed-short-screen-container">
      <div className="test-screen-header">
        Nội dung ngắn đã fix Overscrolling
      </div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại
      </button>
      <div className="fixed-short-content">
        <div className="test-item" style={{ height: '200px', background: 'rgba(0, 255, 0, 0.1)' }}>
          <p>
            Đây là một màn hình có rất ít nội dung, không đủ để tạo thanh cuộn.<br/><br/>
            Thử kéo/vuốt lên xuống và bạn sẽ thấy vấn đề overscrolling đã được khắc phục.<br/><br/>
            Màn hình sẽ không bị "bounce" hoặc kéo ra ngoài ranh giới.
          </p>
        </div>
        
        <div className="test-item" style={{ marginTop: '30px', background: 'rgba(0, 255, 0, 0.2)' }}>
          <div>
            <p>Giải pháp:</p>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              <li>Sử dụng touch-action: none để vô hiệu hóa mọi cử chỉ chạm</li>
              <li>Áp dụng overscroll-behavior: none</li>
              <li>Cố định cả body và container chính</li>
              <li>Sử dụng min-height: 100% để đảm bảo nội dung luôn đủ cao</li>
              <li>Loại bỏ overflow-y: auto khi không cần thiết</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedShortContentScreen; 