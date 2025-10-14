import React, { useEffect } from 'react';
import './SuccessfulPurchasePremium.css';
import shared from './Shared';
import premiumDiamond from './images/Premium_icon_unlocked.png';

const SuccessfulPurchasePremium = ({ isOpen, onClaim, onClose, setShowBuyView }) => {
  useEffect(() => {
    // Clean up payment_success when component unmounts
    return () => {
      localStorage.removeItem('payment_success');
    };
  }, []);

  if (!isOpen) return null;

  const handleClaim = async () => {
    try {
      // Đóng popup trước
      if (onClose) {
        onClose();
      }
      
      // Refresh user profile
      await shared.getProfileWithRetry();
      
      // Navigate to home (MainView) and open Premium
      if (typeof shared.setActiveTab === 'function') {
        // Set flag để MainView tự động mở Premium popup
        shared.shouldOpenPremiumOnHome = true;
        
        // Navigate to home
        shared.setActiveTab('home');
        
        // Đợi một chút để đảm bảo MainView đã render xong, sau đó mở Premium
        setTimeout(() => {
          if (typeof shared.setShowPremium === 'function') {
            shared.setShowPremium();
          }
        }, 300); // Đợi 300ms
      } else {
        setShowBuyView(false);
      }
    } catch (error) {
      console.error('Error during claim:', error);
      setShowBuyView(false);
    }
  };

  return (
    <div className="spp-popup-overlay">
      <div className="spp-popup-container">
        {/* Main Content */}
        <div className="spp-main-content">
          {/* Welcome to Premium Section */}
          <div className="spp-welcome-section">
            <div className="spp-welcome-text">
              <span className="spp-welcome-text-part">WELCOME TO</span>
              <span className="spp-welcome-text-part2">PREMIUM</span>
            </div>
            
            {/* Diamond Container - StepBoostsPopup Style */}
            <div className="spp-popup-purchased">
              <div className="spp-corner spp-top-left-purchased"></div>
              <div className="spp-corner spp-top-right-purchased"></div>
              <div className="spp-corner spp-bottom-left-purchased"></div>
              <div className="spp-corner spp-bottom-right-purchased"></div>

              <div className="spp-body">
                <div className="spp-content">
                  <div className="spp-purchased-message">
                    <div className="spp-purchased-main">
                      <img 
                        src={premiumDiamond} 
                        alt="Premium Diamond" 
                        className="spp-diamond-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* You've Unlocked Section */}
          <div className="spp-unlocked-section">
            <div className="spp-unlocked-banner">YOU'VE UNLOCKED...</div>
            <div className="spp-benefits-list">
              <div className="spp-benefit-item">EXTRA STARLETS</div>
              <div className="spp-benefit-item">MORE STEPS</div>
              <div className="spp-benefit-item">FREEZE STREAKS</div>
              <div className="spp-benefit-item">STEP BOOSTS</div>
            </div>
            <button className="spp-claim-button" onClick={handleClaim}>
              CLAIM REWARDS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuccessfulPurchasePremium;
