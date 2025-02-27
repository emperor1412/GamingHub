import React, { useState, useCallback, useEffect } from 'react';
import './ConfirmPurchasePopup.css';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { handleStarletsPurchase } from './services/telegramPayment';
import SuccessfulPurchasePopup from './SuccessfulPurchasePopup';
import shared from './Shared';

// url: /app/buyOptions
// Request:
// Response:
// {
//     "code": 0,
//     "data": [
//         {
//             "id": 1,
//             "state": 0,
//             "stars": 1,
//             "starlet": 10,
//             "ticket": 1
//         },
//         {
//             "id": 2,
//             "state": 0,
//             "stars": 2,
//             "starlet": 30,
//             "ticket": 2
//         }
//     ]
// }

// url: /app/buyStarlets
// Request:
//     optionId int
// Response:
// {
//     "code": 0,
//     "data": "https://t.me/$rSx3fmgFAFZgAQAAuXGUvcVgAw"
// }


const ConfirmPurchasePopup = ({ isOpen, onClose, amount, stars, onConfirm, setShowProfileView }) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  const showError = useCallback(async (message) => {
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
  }, [onClose]);

  const handleConfirmAndPay = useCallback(async () => {
    try {
      const result = await handleStarletsPurchase({ amount, stars });
      if (result?.status === "paid") {
        onClose();
        setPurchaseData({ initialStarlets: result.initialStarlets });
        setShowSuccessPopup(true);
      } else if (result?.status === "cancelled") {
        onClose();
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      await showError('Unable to process payment. Please try again.');
    }
  }, [amount, stars, onClose, showError]);

  const handleClaim = useCallback(() => {
    setShowSuccessPopup(false);
    setPurchaseData(null);
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    const pendingPayment = localStorage.getItem('payment_pending');
    const paymentSuccess = localStorage.getItem('payment_success');

    if (pendingPayment && paymentSuccess) {
      const payment = JSON.parse(pendingPayment);
      setPurchaseData({ initialStarlets: shared.getStarlets() - payment.amount });
      setShowSuccessPopup(true);
      
      // Clear payment data
      localStorage.removeItem('payment_pending');
      localStorage.removeItem('payment_success');
    }
  }, []);

  if (!isOpen && !showSuccessPopup) return null;

  if (showSuccessPopup) {
    return <SuccessfulPurchasePopup 
      isOpen={true}
      onClaim={handleClaim}
      amount={amount}
      initialStarlets={purchaseData?.initialStarlets}
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