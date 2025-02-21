import React from 'react';
import './ConfirmPurchasePopup.css';
import starlet from './images/starlet.png';
import back from './images/back.svg';

const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="back-button back-button-alignment" onClick={onClose}>
          <img src={back} alt="Back" />
        </button>
        <div className="popup-content">
          <div className="popup-icon">
            <img src={starlet} alt="Starlet" />
          </div>
          <h2 className="popup-title">CONFIRM</h2>
          <div className="popup-subtitle">YOUR PURCHASE</div>
          
          <div className="purchase-details">
            <div className="purchase-text">
              DO YOU WANT TO BUY <span className="highlight-value">{amount} STARLETS</span>
              {stars > 0 && (
                <>
                  <br />
                  AND <span className="highlight-value">10 TICKETS</span> IN FSL GAME HUB
                  <br />
                  FOR <span className="highlight-value">{stars} TELEGRAM STARS</span>?
                </>
              )}
              {stars === 0 && (
                <>
                  <br />
                  AND <span className="highlight-value">10 TICKETS</span> IN FSL GAME HUB
                  <br />
                  FOR <span className="highlight-value">FREE</span>?
                </>
              )}
            </div>
          </div>

          <button className="confirm-button" onClick={onConfirm}>
            CONFIRM & PAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPurchasePopup; 