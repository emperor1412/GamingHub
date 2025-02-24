import React, { useState } from 'react';
import './Buy.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import { trackUserAction } from './analytics';
import ConfirmPurchasePopup from './ConfirmPurchasePopup';
import scratch_ticket_button_bg from './images/scratch_ticket_button_bg.png';
import background from './images/background_2.png';
import back from './images/back.svg';

const Buy = ({ 
  selectedPurchase, 
  setShowBuyView, 
  showFSLIDScreen,
  setSelectedPurchase,
  setShowProfileView 
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handlePaymentMethod = (method) => {
    trackUserAction('buy_payment_method_click', {
      method,
      amount: selectedPurchase?.amount,
      stars: selectedPurchase?.stars
    }, shared.loginData?.link);

    setIsPopupOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!shared.loginData?.fslId) {
      setIsPopupOpen(false);
      setShowBuyView(false);
      showFSLIDScreen();
      return;
    }

    // Process the purchase here
    setIsPopupOpen(false);
    setSelectedPurchase(null);
    setShowBuyView(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      <div className="buy-container">
        <header className="stats-header">
          <button 
            className="back-button back-button-alignment"
            onClick={() => setShowBuyView(false)}
          >
            <img src={back} alt="Back" />
          </button>
          <div className="stats-main">
            <button 
              className="stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={ticketIcon} alt="Tickets" />
              <span className="stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0}
              </span>
            </button>
            <button 
              className="stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={starlet} alt="Starlets" />
              <span className="stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0}
              </span>
            </button>
          </div>
        </header>

        <div className="buy-title">
          <span>BUY</span>
        </div>

        <div className="buy-content">
          <div className="item-display-container">
            <div className="item-display">
              <img src={scratch_ticket_button_bg} alt="Background" className="item-display-bg" />
              <img src={starlet} alt="Item" className="item-icon" />
              <div className="floating-starlets">
                <img src={starlet} alt="Floating Starlet" className="floating-starlet s1" />
                <img src={starlet} alt="Floating Starlet" className="floating-starlet s2" />
                <img src={starlet} alt="Floating Starlet" className="floating-starlet s3" />
                <img src={starlet} alt="Floating Starlet" className="floating-starlet s4" />
                <img src={starlet} alt="Floating Starlet" className="floating-starlet s5" />
              </div>
              <div className="item-details">
                <div className="item-detail-box">
                  <div className="item-amount">
                    <span className="x-mark">x</span>{selectedPurchase?.amount} STARLETS
                  </div>
                </div>
                <div className="item-detail-box">
                  <div className="item-amount">
                    <span className="x-mark">x</span>10 TICKETS
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="item-description">
            USE STARLETS TO LEVEL UP YOUR ACCOUNT AND UNLOCK SPECIAL FEATURES WITHIN FSL GAME HUB
          </div>
        </div>

        <div className="payment-buttons">
          {selectedPurchase?.stars > 0 ? (
            <button 
              className="payment-button stars-button"
              onClick={() => handlePaymentMethod('stars')}
            >
              PAY WITH {selectedPurchase?.stars} STARS
            </button>
          ) : (
            <button 
              className="payment-button stars-button"
              onClick={() => handlePaymentMethod('free')}
            >
              CLAIM FREE
            </button>
          )}
          <button 
            className="payment-button gmt-button"
            onClick={() => handlePaymentMethod('gmt')}
          >
            PAY WITH GMT
          </button>
        </div>

        <ConfirmPurchasePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          amount={selectedPurchase?.amount}
          stars={selectedPurchase?.stars}
          onConfirm={handleConfirmPurchase}
        />
      </div>
    </>
  );
};

export default Buy; 