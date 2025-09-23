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
import premiumBackground from './images/Premium_background_buy.png';
import premiumIcon from './images/Premium_icon.png';

const Buy = ({ 
  selectedPurchase, 
  setShowBuyView, 
  showFSLIDScreen,
  setSelectedPurchase,
  setShowProfileView,
  refreshUserProfile
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

  const handlePaymentMethod = async (method) => {
    if (method === 'free') {
      if (shared.userProfile.fslId === 0) {
        showFSLIDScreen();
        return;
      }
      setIsPopupOpen(true);
      return;
    }

    trackUserAction('buy_payment_method_click', {
      method,
      amount: selectedPurchase?.amount,
      stars: selectedPurchase?.stars,
      optionId: selectedPurchase?.optionId
    }, shared.loginData?.link);

    setIsPopupOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (selectedPurchase) {
      trackUserAction('market_purchase_click', {
        amount: selectedPurchase.amount,
        stars: selectedPurchase.stars,
        optionId: selectedPurchase.optionId,
        price: selectedPurchase.stars === 0 ? 'FREE' : null
      }, shared.loginData?.link);
    }
    
    // Refresh user profile to update starlet data
    if (refreshUserProfile) {
      await refreshUserProfile();
    }
    
    setIsPopupOpen(false);
    setSelectedPurchase(null);
    setShowBuyView(false);
    setShowProfileView(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePaymentMethodPremium = () => {
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="background-container">
        <img src={background} alt="background" />
      </div>
      <div className="bmk-buy-container">
        <header className="bmk-stats-header">
          <button 
            className="back-button back-button-alignment"
            onClick={() => setShowBuyView(false)}
          >
            <img src={back} alt="Back" />
          </button>
          <div className="bmk-stats-main">
            <button 
              className="bmk-stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={ticketIcon} alt="Tickets" />
              <span className="bmk-stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0}
              </span>
            </button>
            <button 
              className="bmk-stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={starlet} alt="Starlets" />
              <span className="bmk-stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0}
              </span>
            </button>
          </div>
        </header>

        <div className="bmk-buy-title">
          <span>BUY</span>
        </div>

        <div className="bmk-buy-content">
          <div className="bmk-item-display-container">
            <div className="bmk-item-display">
              {selectedPurchase?.isPremium ? (
                <>
                  <img src={premiumBackground} alt="Background" className="bmk-item-premium-bg" />
                  <img src={premiumIcon} alt="Item" className="bmk-item-premium-icon" />
                </>
              ) : (
                <>
                  <img src={scratch_ticket_button_bg} alt="Background" className="bmk-item-display-bg" />
                  <img src={starlet} alt="Item" className="bmk-item-icon" />
                </>
              )}
              <div className="bmk-floating-starlets">
                <img src={starlet} alt="Floating Starlet" className="bmk-floating-starlet s1" />
                <img src={starlet} alt="Floating Starlet" className="bmk-floating-starlet s2" />
                <img src={starlet} alt="Floating Starlet" className="bmk-floating-starlet s3" />
                <img src={starlet} alt="Floating Starlet" className="bmk-floating-starlet s4" />
                <img src={starlet} alt="Floating Starlet" className="bmk-floating-starlet s5" />
              </div>
              <div className="bmk-item-details">
              {selectedPurchase?.isPremium ? (
                <>
                  <div className="bmk-item-detail-box">
                    <div className="bmk-item-amount">
                      <span className="x-mark"></span>30 DAYS
                    </div>
                  </div>
                  <div className="bmk-item-detail-box">
                    <div className="bmk-item-amount">
                      <span className="x-mark"></span>X Premium
                    </div>
                  </div>
                </>
              ) : (
                <>
                <div className="bmk-item-detail-box">
                  <div className="bmk-item-amount">
                    <span className="x-mark">x</span>{selectedPurchase?.amount} STARLETS
                  </div>
                </div>
                {(selectedPurchase?.optionId !== 'free' ? currentOption?.ticket : 1) > 0 && (
                  <div className="bmk-item-detail-box">
                    <div className="bmk-item-amount">
                      <span className="x-mark">x</span>{selectedPurchase?.optionId !== 'free' ? currentOption?.ticket : 1} TICKETS
                    </div>
                  </div>
                )}
                </>
              )}
              </div>
            </div>
          </div>

          {selectedPurchase?.isPremium ? (
            <>
            <div className="bmk-item-description">
              GET PREMIUM AND UNLOCK THE FULL FSL GAME HUB EXPERIENCE WITH POWERFUL PERKS THAT GO BEYOND THE BASICS.
            </div>
            </>
          ) : (
            <>
            <div className="bmk-item-description">
              USE STARLETS TO LEVEL UP YOUR ACCOUNT AND UNLOCK SPECIAL FEATURES WITHIN FSL GAME HUB.
            </div>
            </>
          )}
        </div>

        {selectedPurchase?.isPremium ? (
          <>
            <div className="bmk-payment-buttons">
              <button 
              className="bmk-payment-button bmk-stars-button"
              onClick={() => handlePaymentMethodPremium()}
              >
              PAY WITH STARS
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bmk-payment-buttons">
              {selectedPurchase?.stars > 0 ? (
              <button 
                className="bmk-payment-button bmk-stars-button"
                onClick={() => handlePaymentMethod('stars')}
              >
                PAY WITH {selectedPurchase?.stars} STARS
              </button>
              ) : (
              <button 
                className="bmk-payment-button bmk-stars-button"
                onClick={() => handlePaymentMethod('free')}
              >
                CLAIM FREE
              </button>
              )}
              <button 
                className="bmk-payment-button bmk-gmt-button"
                onClick={() => handlePaymentMethod('gmt')}
              >
                PAY WITH GMT
              </button>
            </div>
          </>
        )}
        

        <ConfirmPurchasePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          amount={selectedPurchase?.amount}
          stars={selectedPurchase?.stars}
          optionId={selectedPurchase?.optionId}
          onConfirm={handleConfirmPurchase}
          setShowProfileView={setShowProfileView}
          setShowBuyView={setShowBuyView}
          isStarletProduct={selectedPurchase?.isStarletProduct}
          productId={selectedPurchase?.productId}
          productName={selectedPurchase?.productName}
          isPremium={selectedPurchase?.isPremium}
          refreshUserProfile={refreshUserProfile}
          onPurchaseComplete={async () => {
            if (refreshUserProfile) {
              await refreshUserProfile();
            }
          }}
        />
      </div>
    </>
  );
};

export default Buy; 