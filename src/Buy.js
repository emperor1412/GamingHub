import React from 'react';
import './Buy.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import back from './images/back.svg';
import { trackUserAction } from './analytics';

const Buy = ({ 
  selectedPurchase, 
  setShowBuyView, 
  showFSLIDScreen, 
  setIsPopupOpen, 
  setSelectedPurchase 
}) => {
  const handlePaymentMethod = (method) => {
    if (!shared.loginData?.fslId) {
      setShowBuyView(false);
      showFSLIDScreen();
      return;
    }

    trackUserAction('buy_payment_method_click', {
      method,
      amount: selectedPurchase?.amount,
      stars: selectedPurchase?.stars
    }, shared.loginData?.link);

    setIsPopupOpen(true);
  };

  return (
    <div className="buy-container">
      <div className="buy-top-bar">
        <div className="user-greeting">
          <button className="profile-pic-main">
            <img 
              src={shared.avatars[shared.userProfile ? shared.userProfile.pictureIndex : 0]?.src} 
              alt="Profile" 
            />
          </button>
          <span className="greeting-text">GM! {shared.telegramUserData?.firstName}</span>
        </div>
        <div className="currency-info">
          <div className="currency-item">
            <img src={ticketIcon} alt="Tickets" />
            <span className="currency-value">
              {shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0}
            </span>
          </div>
          <div className="currency-item">
            <img src={starlet} alt="Starlets" />
            <span className="currency-value">
              {shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0}
            </span>
          </div>
        </div>
      </div>

      <button 
        className="back-button back-button-alignment" 
        onClick={() => {
          setShowBuyView(false);
          setSelectedPurchase(null);
        }}
      >
        <img src={back} alt="Back" />
      </button>

      <div className="buy-content">
        <div className="buy-title"><span>BUY</span></div>
        
        <div className="item-display">
          <img src={starlet} alt="Item" className="item-icon" />
        </div>

        <div className="item-details">
          <div className="item-amount">
            {selectedPurchase?.amount} STARLETS
          </div>
          <div className="item-amount">
            10 TICKETS
          </div>
        </div>

        <div className="item-description">
          USE STARLETS TO LEVEL UP YOUR ACCOUNT AND UNLOCK SPECIAL FEATURES WITHIN FSL GAME HUB
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
      </div>
    </div>
  );
};

export default Buy; 