import React from 'react';
import './IntroducePremium.css';
import background from './images/background_2.png';
import premiumDiamond from './images/Premium_icon.png';
import starlet from './images/starlet.png';
import sneaker from './images/banking_step_icon.png';
import stairs from './images/step_challenges_icon.png';


const IntroducePremium = ({ isOpen, onClose, onSelectPlan }) => {
  if (!isOpen) return null;

  const handleYearlySelect = () => {
    if (onSelectPlan) {
      onSelectPlan('yearly');
    }
  };

  const handleMonthlySelect = () => {
    if (onSelectPlan) {
      onSelectPlan('monthly');
    }
  };

  return (
    <div className="ip-popup-overlay">
      <div className="ip-popup-container">
        
        {/* Main Content */}
        <div className="ip-main-content">
          {/* Premium Diamond */}
          <div className="ip-diamond-container">
            <img ư
              src={premiumDiamond}
              alt="Premium Diamond" 
              className="ip-diamond-img"
            />
          </div>

          {/* Subscription Options */}
          <div className="ip-subscription-options">
            {/* Corner borders */}
            <div className="ip-corner ip-top-left"></div>
            <div className="ip-corner ip-top-right"></div>
            <div className="ip-corner ip-bottom-left"></div>
            <div className="ip-corner ip-bottom-right"></div>
            {/* Premium Title */}
            <div className="ip-premium-title">PREMIUM</div>
            <div className="ip-subscription-container">
              <div className="ip-subscription-item ip-yearly-item" onClick={handleYearlySelect}>
                <span className="ip-plan-type">YEARLY</span>
                <div className="ip-plan-price-container">
                  <span className="ip-plan-price">100</span>
                  <img src={starlet} alt="Starlet" className="ip-plan-starlet-icon" />
                </div>
              </div>
              <div className="ip-subscription-item ip-monthly-item" onClick={handleMonthlySelect}>
                <span className="ip-plan-type">MONTHLY</span>
                <div className="ip-plan-price-container">
                  <span className="ip-plan-price">1,000</span>
                  <img src={starlet} alt="Starlet" className="ip-plan-starlet-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="ip-benefits-section">
            <div className="ip-benefits-title">WHAT DO YOU GET FROM PREMIUM?</div>
            <div className="ip-benefits-list">
              <div className="ip-benefit-item">
                <img src={starlet} alt="Star" className="ip-benefit-icon ip-benefit-starlet" />
                <div className="ip-benefit-text-container">
                  <span className="ip-benefit-text">MONTHLY STARLET</span>
                  <span className="ip-benefit-text">ALLOCATION</span>
                </div>
              </div>
              <div className="ip-benefit-item">
                <img src={sneaker} alt="Sneaker" className="ip-benefit-icon ip-benefit-sneaker" />
                <div className="ip-benefit-text-container">
                  <span className="ip-benefit-text">INCREASED DAILY CAP</span>
                  <span className="ip-benefit-text">FOR BANKING STEPS</span>
                </div>
              </div>
              <div className="ip-benefit-item">
                <img src={stairs} alt="Stairs" className="ip-benefit-icon ip-benefit-stairs" />
                <div className="ip-benefit-text-container">
                  <span className="ip-benefit-text">STEP CHALLENGES!</span>
                  <span className="ip-benefit-text ip-benefit-text-small">EARN STEPIN BACKGROUNDS AND BADGES!</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IntroducePremium;
