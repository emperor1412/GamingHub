import React, { useEffect, useRef } from 'react';
import './TestScreens.css';

/**
 * FixedShortContentScreen - màn hình có ít nội dung đã khắc phục lỗi overscrolling
 * Phiên bản này sử dụng kỹ thuật được chứng minh từ Market.css để hoạt động tốt trên mọi thiết bị
 */
const FixedShortContentScreen = ({ onBack }) => {
  const containerRef = useRef(null);
  
  // Áp dụng các kỹ thuật từ Market.css đã được chứng minh hoạt động tốt trên iOS
  useEffect(() => {
    // Thêm class 'mk-market-open' cho body, giống cách làm trong Market
    document.body.classList.add('mk-market-open');
    
    // Clean up khi component unmount
    return () => {
      document.body.classList.remove('mk-market-open');
    };
  }, []);

  // Tạo CSS inline để áp dụng styles từ Market.css
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    color: 'white',
    height: '100%',
    backgroundColor: 'black',
    width: 'min(500px, 100%)',
    margin: '0 auto',
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    overscrollBehavior: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
    zIndex: 1000,
  };

  // Ẩn scrollbar cho Webkit browsers
  const scrollableContentStyle = {
    flex: 1,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    overscrollBehavior: 'contain',
    paddingTop: '80px',
    paddingBottom: '40px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    height: 'calc(100vh - 80px)',
  };

  // Thiết lập style cho header cố định
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'min(500px, 100%)',
    zIndex: 1001, // Tăng z-index để đảm bảo luôn hiển thị phía trên
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: '#0000FF',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    textTransform: 'uppercase',
    boxShadow: '0 2px 10px rgba(0, 0, 255, 0.3)',
    boxSizing: 'border-box',
    height: '70px',
  };

  // Style cho nút back, đặt trên header
  const backButtonStyle = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    zIndex: 1002,
    padding: '8px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  };

  // Style cho card
  const cardStyle = (color) => ({
    background: color,
    margin: '14px 20px',
    padding: '20px',
    borderRadius: '10px',
    minHeight: '80px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  });

  return (
    <>
      {/* Header cố định */}
      <div style={headerStyle}>
        Nội dung ngắn không Overscroll
        <button style={backButtonStyle} onClick={onBack}>
          ← Quay lại
        </button>
      </div>

      {/* Container chính có thể cuộn */}
      <div 
        ref={containerRef}
        style={containerStyle}
      >
        {/* Nội dung có thể cuộn */}
        <div style={scrollableContentStyle}>
          {/* Card 1 */}
          <div style={cardStyle('rgba(0, 200, 255, 0.1)')}>
            <p>
              <strong>Đây là một màn hình có nội dung ngắn.</strong><br/><br/>
              Đã sử dụng cấu trúc và CSS từ Market.css đã được chứng minh hoạt động tốt trên iOS.<br/>
              Thử kéo/vuốt lên xuống để kiểm tra.
            </p>
          </div>
          
          {/* Card 2 */}
          <div style={cardStyle('rgba(0, 200, 255, 0.2)')}>
            <div>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Giải pháp từ Market.css:</p>
              <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '0' }}>
                <li>Sử dụng cấu trúc container đã được chứng minh</li>
                <li>Áp dụng WebkitOverflowScrolling: touch</li>
                <li>Sử dụng class mk-market-open cho body</li>
                <li>Ẩn scrollbar nhưng vẫn giữ chức năng cuộn</li>
                <li>Header cố định luôn hiển thị đúng</li>
              </ul>
            </div>
          </div>
          
          {/* Thêm nhiều card để có thể cuộn */}
          {Array.from({ length: 0 }, (_, i) => (
            <div key={i} style={cardStyle(i % 2 === 0 ? 'rgba(0, 200, 255, 0.05)' : 'rgba(0, 200, 255, 0.1)')}>
              <p>Card có thể cuộn #{i + 1} - Test cuộn trên iOS</p>
            </div>
          ))}
          
          {/* Card cuối cùng */}
          <div style={{...cardStyle('rgba(0, 200, 255, 0.15)'), marginBottom: '100px'}}>
            <p>
              Đây là card cuối cùng - Margin lớn ở dưới để tránh bị che khuất.
            </p>
          </div>
        </div>
      </div>

      {/* Thêm style inline cho việc ẩn scrollbar trên WebKit */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Add a specific body class when screen is open - copied from Market.css */
          body.mk-market-open {
            overscroll-behavior-y: none;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
          
          /* Hide scrollbars for container */
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-content-container'}::-webkit-scrollbar,
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-content-container'}::-webkit-scrollbar-thumb,
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-content-container'}::-webkit-scrollbar-track {
            width: 0 !important;
            height: 0 !important;
            background-color: transparent !important;
            display: none !important;
          }
        `
      }} />
    </>
  );
};

export default FixedShortContentScreen; 