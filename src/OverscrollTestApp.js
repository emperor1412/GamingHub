import React, { useState } from 'react';
import BadScreen from './BadScreen';
import GoodScreen from './GoodScreen';
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
      textAlign: 'center'
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
        marginBottom: '40px',
        textTransform: 'uppercase',
        color: '#0000FF'
      }}>
        So sánh Overscrolling
      </h1>
      
      <div style={{ 
        maxWidth: '600px', 
        marginBottom: '40px',
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
          App này cho phép bạn test hai màn hình: một màn hình bị lỗi overscrolling và 
          một màn hình đã được khắc phục để so sánh sự khác biệt.
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => setCurrentScreen('bad')}
          style={{
            padding: '15px 30px',
            background: 'rgba(255, 0, 0, 0.2)',
            border: '1px solid #FF0000',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '250px'
          }}
        >
          Xem Màn hình LỖI
        </button>
        
        <button
          onClick={() => setCurrentScreen('good')}
          style={{
            padding: '15px 30px',
            background: 'rgba(0, 255, 0, 0.2)',
            border: '1px solid #00FF00',
            borderRadius: '10px',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '250px'
          }}
        >
          Xem Màn hình ĐÃ FIX
        </button>
      </div>
      
      <p style={{ 
        marginTop: '40px', 
        fontSize: '14px', 
        opacity: 0.7,
        maxWidth: '600px'
      }}>
        Lưu ý: Hiệu ứng overscrolling sẽ rõ ràng nhất trên thiết bị di động hoặc khi sử dụng cử chỉ cuộn trên trackpad. 
        Hãy thử cả hai màn hình và cuộn đến cuối để cảm nhận sự khác biệt.
      </p>
    </div>
  );
};

export default OverscrollTestApp; 