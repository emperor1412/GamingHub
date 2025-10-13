import React, { useEffect, useState } from 'react';
import './IntroducePremium.css';
import background from './images/background_2.png';
import premiumDiamond from './images/Premium_icon.png';
import starlet from './images/starlet.png';
import sneaker from './images/banking_step_icon.png';
import stairs from './images/step_challenges_icon.png';
import shared from './Shared';


const IntroducePremium = ({ isOpen, onClose, onSelectPlan, isFromProfile = false, onNavigateToMarket }) => {
  // Premium membership pricing data
  const [membershipData, setMembershipData] = useState({
    typeMonthly: 1,
    typeYearly: 2,
    membershipMonthlyPrice: 100,
    membershipYearlyPrice: 1000
  });

  // Fetch membership pricing data from API
  const fetchMembershipPricing = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for membership pricing API');
        return;
      }
      
      const url = `${shared.server_url}/api/app/membershipBuyData?token=${shared.loginData.token}`;
      console.log('Fetching membership pricing from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Membership pricing API response:', data);
        
        if (data.code === 0 && data.data) {
          const pricingData = data.data;
          
          setMembershipData({
            typeMonthly: pricingData.type_monthly || 1,
            typeYearly: pricingData.type_yearLy || 2,
            membershipMonthlyPrice: pricingData.membershipMonthlyPrice || 100,
            membershipYearlyPrice: pricingData.membershipYearlyPrice || 1000
          });
          
          console.log('✅ Membership pricing data set:', {
            typeMonthly: pricingData.type_monthly,
            typeYearly: pricingData.type_yearLy,
            monthlyPrice: pricingData.membershipMonthlyPrice,
            yearlyPrice: pricingData.membershipYearlyPrice
          });
        } else {
          console.log('Unexpected membership pricing API response format:', data);
        }
      } else {
        console.error('Membership pricing API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching membership pricing:', error);
    }
  };

  // Fetch pricing data when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchMembershipPricing();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleYearlySelect = () => {
    if (onSelectPlan) {
      onSelectPlan('yearly');
    }
    
    // Navigate to market
    if (isFromProfile && onNavigateToMarket) {
      // Use the navigation prop passed from Profile component
      onNavigateToMarket();
    } else if (typeof shared.setActiveTab === 'function') {
      // Fallback to shared method for MainView context
      shared.setInitialMarketTab('starlet');
      shared.setActiveTab('market');
    }
  };

  const handleMonthlySelect = () => {
    if (onSelectPlan) {
      onSelectPlan('monthly');
    }
    
    // Navigate to market
    if (isFromProfile && onNavigateToMarket) {
      // Use the navigation prop passed from Profile component
      onNavigateToMarket();
    } else if (typeof shared.setActiveTab === 'function') {
      // Fallback to shared method for MainView context
      shared.setInitialMarketTab('starlet');
      shared.setActiveTab('market');
    }
  };

  return (
    <div className={`ip-popup-overlay ${isFromProfile ? 'fullscreen' : 'mainview'}`}>
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
                  <span className="ip-plan-price">{membershipData.membershipYearlyPrice.toLocaleString()}</span>
                  <img src={starlet} alt="Starlet" className="ip-plan-starlet-icon" />
                </div>
              </div>
              <div className="ip-subscription-item ip-monthly-item" onClick={handleMonthlySelect}>
                <span className="ip-plan-type">MONTHLY</span>
                <div className="ip-plan-price-container">
                  <span className="ip-plan-price">{membershipData.membershipMonthlyPrice.toLocaleString()}</span>
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
