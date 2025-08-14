import React from 'react';

function CoinAnimation({ loop = true, visible = true, onFinished, scale = 1 }) {
  if (!visible) return null;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: `scale(${scale})`
    }}>
      <iframe
        src="/flippin_coin_animation/CoinAnim.html"
        style={{ 
          width: '100%', 
          height: '100%',
          maxWidth: '300px',
          maxHeight: '300px',
          border: 'none',
          background: 'transparent'
        }}
        title="Coin Flip Animation"
        allow="autoplay"
      />
    </div>
  );
}

export default CoinAnimation;
