import React, { useEffect, useState } from 'react';
import './IntroducePremium.css';
import background from './images/background_2.png';
import premiumDiamond from './images/Premium_icon.png';
import starlet from './images/starlet.png';
// import telegram_premium from './images/Telegram_Premium.png'; // OLD: Telegram Stars icon
import sneaker from './images/banking_step_icon.png';
import badges from './images/stepBoost_trophy_unlocked.png';
import shared from './Shared';


const IntroducePremium = ({ isOpen, onClose, onSelectPlan, isFromProfile = false, onNavigateToMarket }) => {
  // Premium membership pricing - fetched from starletProducts
  const [monthlyPrice, setMonthlyPrice] = useState(100);
  const [yearlyPrice, setYearlyPrice] = useState(1000);

  // Fetch membership pricing from starletProducts API
  const fetchMembershipPricing = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for membership pricing API');
        return;
      }
      
      const url = `${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`;
      console.log('Fetching starlet products for membership pricing:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('StarletProducts API response:', data);
        
        if (data.code === 0 && Array.isArray(data.data)) {
          // Find membership products
          const monthlyMembership = data.data.find(p => p.prop === 80010);
          const yearlyMembership = data.data.find(p => p.prop === 80020);
          
          if (monthlyMembership) {
            setMonthlyPrice(monthlyMembership.starlet);
          }
          if (yearlyMembership) {
            setYearlyPrice(yearlyMembership.starlet);
          }
          
          console.log('✅ Membership pricing from starletProducts:', {
            monthlyPrice: monthlyMembership?.starlet,
            yearlyPrice: yearlyMembership?.starlet
          });
        } else if (data.code === 102002 || data.code === 102001) {
          // Token expired, attempt to refresh
          console.log('Token expired, attempting to refresh...');
          const result = await shared.login(shared.initData);
          if (result.success) {
            // Retry the fetch after login
            const retryResponse = await fetch(`${shared.server_url}/api/app/starletProducts?token=${shared.loginData.token}`);
            const retryData = await retryResponse.json();
            if (retryData.code === 0 && Array.isArray(retryData.data)) {
              const monthlyMembership = retryData.data.find(p => p.prop === 80010);
              const yearlyMembership = retryData.data.find(p => p.prop === 80020);
              
              if (monthlyMembership) {
                setMonthlyPrice(monthlyMembership.starlet);
              }
              if (yearlyMembership) {
                setYearlyPrice(yearlyMembership.starlet);
              }
            }
          }
        } else {
          console.log('Unexpected starletProducts API response format:', data);
        }
      } else {
        console.error('StarletProducts API response not ok:', response.status);
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
    
    // Navigate to market - premium membership is now in starlet tab
    if (isFromProfile && onNavigateToMarket) {
      // Use the navigation prop passed from Profile component
      onNavigateToMarket();
    } else if (typeof shared.setActiveTab === 'function') {
      // Fallback to shared method for MainView context
      shared.setInitialMarketTab('starlet'); // Changed from 'telegram' to 'starlet'
      shared.setInitialMarketCategory('premium-membership');
      shared.setActiveTab('market');
    }
  };

  const handleMonthlySelect = () => {
    if (onSelectPlan) {
      onSelectPlan('monthly');
    }
    
    // Navigate to market - premium membership is now in starlet tab
    if (isFromProfile && onNavigateToMarket) {
      // Use the navigation prop passed from Profile component
      onNavigateToMarket();
    } else if (typeof shared.setActiveTab === 'function') {
      // Fallback to shared method for MainView context
      shared.setInitialMarketTab('starlet'); // Changed from 'telegram' to 'starlet'
      shared.setInitialMarketCategory('premium-membership');
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
            <img
              src={premiumDiamond}
              alt="Premium Diamond" 
              className="ip-diamond-img"
            />
          </div>

          {/* Subscription Options */}
          <div className="ip-subscription-options">
            {/* Corner borders */}
            {/* <div className="ip-corner ip-top-left"></div>
            <div className="ip-corner ip-top-right"></div>
            <div className="ip-corner ip-bottom-left"></div>
            <div className="ip-corner ip-bottom-right"></div> */}
            {/* Premium Title */}
            <div className="ip-premium-title">PREMIUM</div>
            <div className="ip-subscription-container">
              <div className="ip-subscription-item ip-yearly-item">
                <span className="ip-plan-type" onClick={handleYearlySelect}>
                  {/* Corner borders cho plan type */}
                  <div className="ip-corner ip-top-left-plan"></div>
                  <div className="ip-corner ip-top-right-plan"></div>
                  <div className="ip-corner ip-bottom-left-plan"></div>
                  <div className="ip-corner ip-bottom-right-plan"></div>
                  YEARLY
                </span>
                <div className="ip-plan-price-container">
                  <span className="ip-plan-price">{yearlyPrice.toLocaleString()}</span>
                  <img src={starlet} alt="Starlet" className="ip-plan-starlet-icon" />
                </div>
              </div>
              <div className="ip-subscription-item ip-monthly-item">
                <span className="ip-plan-type" onClick={handleMonthlySelect}>
                  {/* Corner borders cho plan type */}
                  <div className="ip-corner ip-top-left-plan"></div>
                  <div className="ip-corner ip-top-right-plan"></div>
                  <div className="ip-corner ip-bottom-left-plan"></div>
                  <div className="ip-corner ip-bottom-right-plan"></div>
                  MONTHLY
                </span>
                <div className="ip-plan-price-container">
                  <span className="ip-plan-price">{monthlyPrice.toLocaleString()}</span>
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
                <img src={badges} alt="Stairs" className="ip-benefit-icon ip-benefit-stairs" />
                <div className="ip-benefit-text-container">
                  <span className="ip-benefit-text">STEP CHALLENGES!</span>
                  <span className="ip-benefit-text ip-benefit-text-small">COMING SOON</span>
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
