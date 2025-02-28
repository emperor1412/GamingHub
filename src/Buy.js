import React, { useState, useEffect } from 'react';
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
  const [currentOption, setCurrentOption] = useState(null);

  useEffect(() => {
    const fetchOptionData = async () => {
      if (!selectedPurchase?.optionId) return;
      
      try {
        const response = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
        const data = await response.json();
        if (data.code === 0 && Array.isArray(data.data)) {
          const option = data.data.find(opt => opt.id === selectedPurchase.optionId);
          if (option) {
            setCurrentOption(option);
          }
        } else if (data.code === 102002 || data.code === 102001) {
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            const retryResponse = await fetch(`${shared.server_url}/api/app/buyOptions?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              const option = retryData.data.find(opt => opt.id === selectedPurchase.optionId);
              if (option) {
                setCurrentOption(option);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch option data:', error);
      }
    };

    fetchOptionData();
  }, [selectedPurchase?.optionId]);

  const handlePaymentMethod = (method) => {
    trackUserAction('buy_payment_method_click', {
      method,
      amount: selectedPurchase?.amount,
      stars: selectedPurchase?.stars,
      optionId: selectedPurchase?.optionId
    }, shared.loginData?.link);

    setIsPopupOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedPurchase) {
      trackUserAction('market_purchase_click', {
        amount: selectedPurchase.amount,
        stars: selectedPurchase.stars,
        optionId: selectedPurchase.optionId,
        price: selectedPurchase.stars === 0 ? 'FREE' : null
      }, shared.loginData?.link);
    }
    setIsPopupOpen(false);
    setSelectedPurchase(null);
    setShowBuyView(false);
    setShowProfileView(false);
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
                    <span className="x-mark">x</span>{currentOption?.ticket || 10} TICKETS
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
          optionId={selectedPurchase?.optionId}
          onConfirm={handleConfirmPurchase}
          setShowProfileView={setShowProfileView}
          setShowBuyView={setShowBuyView}
        />
      </div>
    </>
  );
};

export default Buy; 