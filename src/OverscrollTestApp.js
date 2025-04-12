import React, { useState, useEffect, useRef } from 'react';
import BadScreen from './BadScreen';
import GoodScreen from './GoodScreen';
import ShortContentScreen from './ShortContentScreen';
import FixedShortContentScreen from './FixedShortContentScreen';
import BadPopupScreen from './BadPopupScreen';
import GoodPopupScreen from './GoodPopupScreen';
import './TestScreens.css';

/**
 * OverscrollTestApp - Component chính điều khiển việc chuyển đổi giữa 
 * màn hình có và không có vấn đề overscrolling
 * Đã cải tiến để hoạt động mượt trên iOS
 */
const OverscrollTestApp = ({ onBack }) => {
  const [currentScreen, setCurrentScreen] = useState(null);
  const containerRef = useRef(null);

  // Thêm useEffect để áp dụng kỹ thuật từ Market.css - chỉ khi không hiển thị màn hình cụ thể
  useEffect(() => {
    if (currentScreen === null) {
      // Thêm class từ Market.css khi hiển thị màn hình chính
      document.body.classList.add('mk-market-open');
      
      return () => {
        // Remove class khi unmount
        document.body.classList.remove('mk-market-open');
      };
    }
  }, [currentScreen]);

  const handleBack = () => {
    setCurrentScreen(null);
  };

  if (currentScreen === 'bad') {
    return <BadScreen onBack={handleBack} />;
  } else if (currentScreen === 'good') {
    return <GoodScreen onBack={handleBack} />;
  } else if (currentScreen === 'short') {
    return <ShortContentScreen onBack={handleBack} />;
  } else if (currentScreen === 'fixedShort') {
    return <FixedShortContentScreen onBack={handleBack} />;
  } else if (currentScreen === 'badPopup') {
    return <BadPopupScreen onBack={handleBack} />;
  } else if (currentScreen === 'goodPopup') {
    return <GoodPopupScreen onBack={handleBack} />;
  }

  // Styles cho container chính - sử dụng các kỹ thuật từ Market.css
  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    backgroundColor: 'black',
    width: 'min(600px, 100%)',
    margin: '0 auto',
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    height: '100%',
    overflowY: 'auto',
    overscrollBehavior: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE and Edge
    padding: '20px',
    boxSizing: 'border-box',
    textAlign: 'center',
    zIndex: 1000,
  };

  // Style cho nội dung có thể cuộn
  const scrollableContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: '60px',
    paddingBottom: '40px',
  };

  return (
    <>
      <div
        ref={containerRef}
        style={mainContainerStyle}
      >
        <div style={scrollableContentStyle}>
          {onBack && (
            <button 
              onClick={onBack}
              style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                zIndex: 1001
              }}
            >
              ← Quay lại ứng dụng
            </button>
          )}
          
          <h1 style={{ 
            fontSize: '28px', 
            marginBottom: '30px',
            textTransform: 'uppercase',
            color: '#0000FF'
          }}>
            So sánh Overscrolling
          </h1>
          
          <div style={{ 
            width: '100%', 
            maxWidth: '500px', 
            marginBottom: '30px',
            lineHeight: '1.6',
            background: 'rgba(255,255,255,0.05)',
            padding: '20px',
            borderRadius: '10px',
            boxSizing: 'border-box'
          }}>
            <p>
              <strong style={{ color: '#0000FF' }}>Overscrolling</strong> là hiện tượng khi người dùng cuộn vượt quá ranh giới của nội dung, 
              trình duyệt sẽ hiển thị hiệu ứng "bounce" hoặc kéo màn hình ra ngoài ranh giới.
            </p>
            <p style={{ marginTop: '10px' }}>
              App này cho phép bạn test nhiều kịch bản overscrolling khác nhau và cách khắc phục.
            </p>
          </div>
          
          <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px', width: '100%' }}>
            Trường hợp 1: Trang có nhiều nội dung
          </h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px', width: '100%' }}>
            <button
              onClick={() => setCurrentScreen('bad')}
              style={{
                padding: '12px 15px',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid #FF0000',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Xem Màn hình LỖI
            </button>
            
            <button
              onClick={() => setCurrentScreen('good')}
              style={{
                padding: '12px 15px',
                background: 'rgba(0, 255, 0, 0.2)',
                border: '1px solid #00FF00',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Xem Màn hình ĐÃ FIX
            </button>
          </div>
          
          <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px', width: '100%' }}>
            Trường hợp 2: Trang có ít nội dung
          </h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px', width: '100%' }}>
            <button
              onClick={() => setCurrentScreen('short')}
              style={{
                padding: '12px 15px',
                background: 'rgba(255, 165, 0, 0.2)',
                border: '1px solid #FFA500',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Nội dung ngắn - Có LỖI
            </button>
            
            <button
              onClick={() => setCurrentScreen('fixedShort')}
              style={{
                padding: '12px 15px',
                background: 'rgba(0, 255, 0, 0.2)',
                border: '1px solid #00FF00',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Nội dung ngắn - Cuộn không bounce
            </button>
          </div>
          
          <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px', width: '100%' }}>
            Trường hợp 3: Popup Modal
          </h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px', width: '100%' }}>
            <button
              onClick={() => setCurrentScreen('badPopup')}
              style={{
                padding: '12px 15px',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '1px solid #FF0000',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Popup - Có LỖI
            </button>
            
            <button
              onClick={() => setCurrentScreen('goodPopup')}
              style={{
                padding: '12px 15px',
                background: 'rgba(0, 255, 0, 0.2)',
                border: '1px solid #00FF00',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: 'bold',
                minWidth: '200px'
              }}
            >
              Popup - ĐÃ FIX
            </button>
          </div>
          
          <p style={{ 
            marginTop: '20px', 
            fontSize: '14px', 
            opacity: 0.7,
            maxWidth: '500px',
            marginBottom: '60px'
          }}>
            Lưu ý: Hiệu ứng overscrolling sẽ rõ ràng nhất trên thiết bị di động hoặc khi sử dụng cử chỉ cuộn trên trackpad. 
            Hãy thử tất cả các trường hợp để cảm nhận sự khác biệt.
          </p>
        </div>
      </div>

      {/* Thêm style inline cho việc ẩn scrollbar trên WebKit */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Add a specific body class when component is open - copied from Market.css */
          body.mk-market-open {
            overscroll-behavior-y: none;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
          
          /* Hide scrollbars for container */
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-container'}::-webkit-scrollbar,
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-container'}::-webkit-scrollbar-thumb,
          ${containerRef.current ? `#${containerRef.current.id}` : '.scrollable-container'}::-webkit-scrollbar-track {
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

export default OverscrollTestApp; 