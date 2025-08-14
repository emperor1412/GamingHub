import React from 'react';
import Lottie from 'lottie-react';

// Import animation data từ file JSON thực tế từ artist
import coinAnimationData from './animations/CoinAnim.json';

function CoinAnimation({ loop = true, visible = true, onFinished, scale = 1 }) {
  if (!visible) return null;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale * 0.8})` // Giảm kích thước xuống 80% của scale được truyền vào
    }}>
      <Lottie
        animationData={coinAnimationData}
        loop={loop}
        autoplay={visible}
        onComplete={onFinished}
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: '300px',
          maxHeight: '300px'
        }}
      />
    </div>
  );
}

export default CoinAnimation;