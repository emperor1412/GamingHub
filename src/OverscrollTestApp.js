import React, { useState } from 'react';
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
 */
const OverscrollTestApp = ({ onBack }) => {
  const [currentScreen, setCurrentScreen] = useState(null);

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

  return (
    <div style={{
      backgroundColor: '#000',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      overflowY: 'auto'
    }}>
      {onBack && (
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
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
        maxWidth: '600px', 
        marginBottom: '30px',
        lineHeight: '1.6',
        background: 'rgba(255,255,255,0.05)',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <p>
          <strong style={{ color: '#0000FF' }}>Overscrolling</strong> là hiện tượng khi người dùng cuộn vượt quá ranh giới của nội dung, 
          trình duyệt sẽ hiển thị hiệu ứng "bounce" hoặc kéo màn hình ra ngoài ranh giới.
        </p>
        <p style={{ marginTop: '10px' }}>
          App này cho phép bạn test nhiều kịch bản overscrolling khác nhau và cách khắc phục.
        </p>
      </div>
      
      <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px' }}>
        Trường hợp 1: Trang có nhiều nội dung
      </h2>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
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
      
      <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px' }}>
        Trường hợp 2: Trang có ít nội dung
      </h2>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
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
          Nội dung ngắn - ĐÃ FIX
        </button>
      </div>
      
      <h2 style={{ color: '#FFF', marginBottom: '15px', fontSize: '20px' }}>
        Trường hợp 3: Popup Modal
      </h2>
      
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '30px' }}>
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
        maxWidth: '600px'
      }}>
        Lưu ý: Hiệu ứng overscrolling sẽ rõ ràng nhất trên thiết bị di động hoặc khi sử dụng cử chỉ cuộn trên trackpad. 
        Hãy thử tất cả các trường hợp để cảm nhận sự khác biệt.
      </p>
    </div>
  );
};

export default OverscrollTestApp; 