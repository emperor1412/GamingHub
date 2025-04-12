import React, { useState, useEffect } from 'react';
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

  // Render appropriate screen based on selection
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

  // Elements for category buttons
  const renderCategoryButtons = (title, buttons) => (
    <>
      <h2 className="category-title">{title}</h2>
      <div className="button-container">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => setCurrentScreen(button.screen)}
            className={`screen-button ${button.variant}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="overscroll-test-app">
      <div className="app-header">
        <h1>So sánh Overscrolling</h1>
        <button className="back-button" onClick={onBack}>
          ← Quay lại ứng dụng
        </button>
      </div>

      <div className="app-content">
        <div className="app-description">
          <p>
            <strong className="highlight">Overscrolling</strong> là hiện tượng khi người dùng cuộn vượt quá ranh giới của nội dung, 
            trình duyệt sẽ hiển thị hiệu ứng "bounce" hoặc kéo màn hình ra ngoài ranh giới.
          </p>
          <p>
            App này cho phép bạn test nhiều kịch bản overscrolling khác nhau và cách khắc phục.
          </p>
        </div>
        
        {renderCategoryButtons("Trường hợp 1: Trang có nhiều nội dung", [
          { label: "Xem Màn hình LỖI", screen: "bad", variant: "error" },
          { label: "Xem Màn hình ĐÃ FIX", screen: "good", variant: "success" }
        ])}
        
        {renderCategoryButtons("Trường hợp 2: Trang có ít nội dung", [
          { label: "Nội dung ngắn - Có LỖI", screen: "short", variant: "warning" },
          { label: "Nội dung ngắn - Cuộn không bounce", screen: "fixedShort", variant: "success" }
        ])}
        
        {renderCategoryButtons("Trường hợp 3: Popup Modal", [
          { label: "Popup - Có LỖI", screen: "badPopup", variant: "error" },
          { label: "Popup - ĐÃ FIX", screen: "goodPopup", variant: "success" }
        ])}
        
        <p className="app-note">
          Lưu ý: Hiệu ứng overscrolling sẽ rõ ràng nhất trên thiết bị di động hoặc khi sử dụng cử chỉ cuộn trên trackpad. 
          Hãy thử tất cả các trường hợp để cảm nhận sự khác biệt.
        </p>
      </div>

      <button className="float-button" onClick={onBack}>
        Quay lại
      </button>
    </div>
  );
};

export default OverscrollTestApp; 