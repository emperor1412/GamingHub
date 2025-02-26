import React, { useState } from 'react';
import './ConfirmPurchasePopup.css';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';
import SuccessfulPurchasePopup from './SuccessfulPurchasePopup';

const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, onConfirm, setShowProfileView }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  if (!isOpen && !showSuccessPopup) return null;

  const showError = async (message) => {
    onClose();
    await new Promise(resolve => setTimeout(resolve, 100));

    if (window.Telegram?.WebApp?.showPopup) {
      try {
        await window.Telegram.WebApp.showPopup({
          title: 'Error',
          message: message,
          buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
        });
      } catch (error) {
        console.error('Failed to show popup:', error);
        alert(message);
      }
    } else {
      alert(message);
    }
  };

  const handleConfirmAndPay = async () => {
    try {
      const result = await handleStarletsPurchase({ amount, stars });
      if (result?.status === "paid") {
        onClose();
        setShowSuccessPopup(true);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError('Unable to process payment. Please try again.');
    }
  };

  const handleClaim = () => {
    setShowSuccessPopup(false);
    onConfirm();
  };

  if (showSuccessPopup) {
    return <SuccessfulPurchasePopup 
      isOpen={true}
      onClaim={handleClaim}
      amount={amount}
      setShowProfileView={setShowProfileView}
    />;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="cfm_back-button back-button-alignment" onClick={onClose}>
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

          <button className="confirm-button" onClick={handleConfirmAndPay}>
            CONFIRM & PAY
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPurchasePopup; 