import React, { useState, useEffect } from 'react';
import './PremiumSubscriptionScene.css';
import shared from './Shared';
import ticketIcon from './images/ticket.svg';
import starlet from './images/starlet.png';
import { trackUserAction } from './analytics';
import ConfirmPurchasePopup from './ConfirmPurchasePopup';
import back from './images/back.svg';
import premiumBackground from './images/Premium_background_buy.png';
import premiumIcon from './images/Premium_icon.png';
import sneaker from './images/banking_step_icon.png';
import stairs from './images/step_challenges_icon.png';

const PremiumSubscriptionScene = ({ 
  setShowPremiumSubscriptionScene,
  setShowProfileView,
  refreshUserProfile
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [membershipData, setMembershipData] = useState(null);

  // Fetch membership data
  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        const response = await fetch(`${shared.server_url}/api/app/getMembershipData?token=${shared.loginData.token}`);
        const data = await response.json();
        if (data.code === 0 && data.data) {
          setMembershipData(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch membership data:', error);
      }
    };

    fetchMembershipData();
  }, []);

  const handlePlanSelect = (planType) => {
    const price = planType === 'monthly' ? 
      (membershipData?.membershipMonthlyPrice || 1000) : 
      (membershipData?.membershipYearlyPrice || 100);
    
    const membershipType = planType === 'monthly' ? 
      (membershipData?.typeMonthly || 'monthly') : 
      (membershipData?.typeYearly || 'yearly');

    setSelectedPlan({
      amount: price,
      stars: 0,
      productId: membershipType,
      productName: `Premium Membership ${planType === 'monthly' ? 'Monthly' : 'Yearly'}`,
      isStarletProduct: true,
      isPremium: true,
      optionId: null,
      planType: planType
    });
    
    setIsPopupOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (selectedPlan) {
      trackUserAction('premium_subscription_purchase_click', {
        planType: selectedPlan.planType,
        amount: selectedPlan.amount,
        productId: selectedPlan.productId
      }, shared.loginData?.link);
    }
    
    // Refresh user profile to update premium status
    if (refreshUserProfile) {
      await refreshUserProfile();
    }
    
    setIsPopupOpen(false);
    setSelectedPlan(null);
    setShowPremiumSubscriptionScene(false);
    setShowProfileView(false);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="psc-container">
        <header className="psc-stats-header">
          <button 
            className="back-button back-button-alignment"
            onClick={() => setShowPremiumSubscriptionScene(false)}
          >
            <img src={back} alt="Back" />
          </button>
          <div className="psc-stats-main">
            <button 
              className="psc-stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={ticketIcon} alt="Tickets" />
              <span className="psc-stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10010)?.num || 0}
              </span>
            </button>
            <button 
              className="psc-stat-item-main"
              onClick={() => setShowProfileView(true)}
            >
              <img src={starlet} alt="Starlets" />
              <span className="psc-stat-item-main-text">
                {shared.userProfile?.UserToken?.find(token => token.prop_id === 10020)?.num || 0}
              </span>
            </button>
          </div>
        </header>

        

        <div className="psc-content">
          {/* Premium Diamond Display */}
          <div className="psc-premium-display-container">
            <div className="psc-premium-display">
              <img src={premiumIcon} alt="Premium Diamond" className="psc-premium-icon" />
              <div className="psc-floating-stars">
                <div className="psc-star s1">★</div>
                <div className="psc-star s2">★</div>
                <div className="psc-star s3">★</div>
                <div className="psc-star s4">★</div>
                <div className="psc-star s5">★</div>
              </div>
            </div>
          </div>

          {/* Premium Section with Corner Borders */}
          <div className="psc-premium-section">
            {/* Corner borders */}
            <div className="psc-corner psc-top-left"></div>
            <div className="psc-corner psc-top-right"></div>
            <div className="psc-corner psc-bottom-left"></div>
            <div className="psc-corner psc-bottom-right"></div>
            
            <div className="psc-title">
              <span>PREMIUM</span>
            </div>

            <div className="psc-subscription-container">
              <div className="psc-subscription-item" onClick={() => handlePlanSelect('yearly')}>
                <span className="psc-plan-type">YEARLY</span>
                <div className="psc-plan-price-container">
                  <span className="psc-plan-price">{membershipData?.membershipYearlyPrice || 100}</span>
                  <img src={starlet} alt="Starlet" className="psc-plan-starlet-icon" />
                </div>
              </div>
              <div className="psc-subscription-item" onClick={() => handlePlanSelect('monthly')}>
                <span className="psc-plan-type">MONTHLY</span>
                <div className="psc-plan-price-container">
                  <span className="psc-plan-price">{membershipData?.membershipMonthlyPrice || 1000}</span>
                  <img src={starlet} alt="Starlet" className="psc-plan-starlet-icon" />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="psc-benefits-section">
            <div className="psc-benefits-title">WHAT DO YOU GET FROM PREMIUM?</div>
            <div className="psc-benefits-list">
              <div className="psc-benefit-item">
                <img src={starlet} alt="Starlet" className="psc-benefit-icon" />
                <div className="psc-benefit-text-container">
                  <span className="psc-benefit-text">MONTHLY STARLET</span>
                  <span className="psc-benefit-text">ALLOCATION</span>
                </div>
              </div>
              <div className="psc-benefit-item">
                <img src={sneaker} alt="Sneaker" className="psc-benefit-icon" />
                <div className="psc-benefit-text-container">
                  <span className="psc-benefit-text">INCREASED DAILY CAP</span>
                  <span className="psc-benefit-text">FOR BANKING STEPS</span>
                </div>
              </div>
              <div className="psc-benefit-item">
                <img src={stairs} alt="Stairs" className="psc-benefit-icon" />
                <div className="psc-benefit-text-container">
                  <span className="psc-benefit-text">STEP CHALLENGES!</span>
                  <span className="psc-benefit-text-small">EARN STEPN BACKGROUNDS AND BADGES!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ConfirmPurchasePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          amount={selectedPlan?.amount}
          stars={selectedPlan?.stars}
          optionId={selectedPlan?.optionId}
          onConfirm={handleConfirmPurchase}
          setShowProfileView={setShowProfileView}
          setShowBuyView={() => setShowPremiumSubscriptionScene(false)}
          isStarletProduct={selectedPlan?.isStarletProduct}
          productId={selectedPlan?.productId}
          productName={selectedPlan?.productName}
          isPremium={selectedPlan?.isPremium}
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

export default PremiumSubscriptionScene;
