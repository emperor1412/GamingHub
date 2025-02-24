import React from 'react';
import './ConfirmPurchasePopup.css';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';

const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, onConfirm }) => {
  if (!isOpen) return null;

  const showError = async (message) => {
    // Đóng confirm popup trước
    onClose();
    
    // Đợi một chút để đảm bảo popup đã đóng
    await new Promise(resolve => setTimeout(resolve, 100));

    if (window.Telegram?.WebApp?.showPopup) {
      try {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: message,
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      } catch (error) {
        // Fallback nếu không thể hiển thị popup
        console.error('Failed to show popup:', error);
        alert(message);
      }
    } else {
      // Fallback cho development environment
      alert(message);
    }
  };

  const handleConfirmAndPay = async () => {
    try {
      const result = await handleStarletsPurchase({ amount, stars });
      if (result) {
        onConfirm();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError('Unable to process payment. Please try again.');
    }
  };

  return (
    <div className="popup-overlay">
      <button className="cfm_back-button back-button-alignment" onClick={onClose}>
        <img src={back} alt="Back" />
      </button>
      <div className="popup-container">
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

          <button className="confirm-button" onClick={handleConfirmAndPay}>
            CONFIRM & PAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPurchasePopup; 