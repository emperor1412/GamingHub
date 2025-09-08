import React, { useEffect, useState, useRef } from 'react';
import './StepBoostsPopup.css';
import iconStepBoostx1_5 from './images/Icon_StepBoosts_x1_5.png';
import iconStepBoostx2 from './images/Icon_StepBoosts_x2.png';
import iconPopStepBoostx1_5 from './images/Icon_Pop_Stepboosts_1_5X.png';
import iconPopStepBoostx2 from './images/Icon_Pop_Stepboosts_2X.png';
import starletIcon from './images/starlet.png';
import shared from './Shared';
import stepBoostsPurchasedBg from './images/Icon_Status_Stepboosts.png';

const StepBoostsPopup = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onPurchase 
}) => {
  // Step boost assets mapping
  const stepBoostAssets = {
    1: { icon: iconPopStepBoostx1_5 },
    2: { icon: iconPopStepBoostx2 },
  };

  // Track confirmation after clicking YES
  const [confirmed, setConfirmed] = useState(false);
  // Preserve popup size when confirming so it doesn't change
  const popupRef = useRef(null);
  const [fixedHeight, setFixedHeight] = useState(null);
  const [fixedWidth, setFixedWidth] = useState(null);
  // Track processing state for API calls
  const [isProcessing, setIsProcessing] = useState(false);

  // Reset confirmation only when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
      setFixedHeight(null);
      setFixedWidth(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Adjust background image when button margin changes
  useEffect(() => {
    if (confirmed && popupRef.current) {
      const actionsElement = popupRef.current.querySelector('.step-boosts-actions');
      if (actionsElement) {
        const updateBackgroundPosition = () => {
          const computedStyle = window.getComputedStyle(actionsElement);
          const marginBottom = parseInt(computedStyle.marginBottom) || 0;
          const marginTop = parseInt(computedStyle.marginTop) || 0;
          const totalMargin = marginBottom + marginTop;
          
          // Update CSS custom property for dynamic calculation
          popupRef.current.style.setProperty('--button-margin', `${totalMargin}px`);
        };
        
        // Initial update
        updateBackgroundPosition();
        
        // Watch for style changes
        const observer = new MutationObserver(updateBackgroundPosition);
        observer.observe(actionsElement, { 
          attributes: true, 
          attributeFilter: ['style'] 
        });
        
        return () => observer.disconnect();
      }
    }
  }, [confirmed]);

  const handlePurchase = () => {
    setConfirmed(true);
    setIsProcessing(true);
  };

  const handleNoThanks = () => {
    onClose();
  };

  const handleYes = () => {
    // Capture current popup size before content changes
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setFixedHeight(rect.height);
      setFixedWidth(rect.width);
    }
    onPurchase(selectedPackage);
    setConfirmed(true);
  };

  const handleConfirmAndPay = async () => {
    if (isProcessing) return; // Prevent multiple calls
    
    console.log('handleConfirmAndPay called with selectedPackage:', selectedPackage);
    setIsProcessing(true);
    
    try {
      // Check if selectedPackage has productId
      if (!selectedPackage.productId) {
        console.error('No productId found in selectedPackage');
        await shared.showPopup({
          type: 0,
          title: 'Error',
          message: 'Product ID not found. Please try again.'
        });
        return;
      }

      console.log('Making buyStarletProduct API call with productId:', selectedPackage.productId);
      
      // Make API call to buyStarletProduct
      const response = await fetch(`${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}&productId=${selectedPackage.productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log('buyStarletProduct API response:', data);
      
      if (data.code === 0) {
        // Success - show confirmation
        console.log('Purchase successful');
        onPurchase(selectedPackage);
        setConfirmed(true);
        
        // Refresh user profile to get updated data
        await shared.getProfileWithRetry();
        
      } else if (data.code === 102002 || data.code === 102001) {
        // Token expired - try to refresh
        console.log('Token expired, attempting to refresh...');
        const loginResult = await shared.login(shared.initData);
        
        if (loginResult.success) {
          // Retry the purchase with new token
          const retryResponse = await fetch(`${shared.server_url}/api/app/buyStarletProduct?token=${shared.loginData.token}&productId=${selectedPackage.productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const retryData = await retryResponse.json();
          if (retryData.code === 0) {
            console.log('Retry purchase successful');
            onPurchase(selectedPackage);
            setConfirmed(true);
            await shared.getProfileWithRetry();
          } else {
            console.error('Retry failed:', retryData);
            await shared.showPopup({
              type: 0,
              title: 'Purchase Failed',
              message: retryData.msg || 'Payment failed. Please try again.'
            });
          }
        } else {
          await shared.showPopup({
            type: 0,
            title: 'Session Expired',
            message: 'Please try again.'
          });
        }
      } else {
        // Other errors
        console.error('Purchase failed:', data);
        await shared.showPopup({
          type: 0,
          title: 'Purchase Failed',
          message: data.msg || 'Payment failed. Please try again.'
        });
      }
      
    } catch (error) {
      console.error('Purchase error:', error);
      await shared.showPopup({
        type: 0,
        title: 'Error',
        message: error?.message || 'Unable to process payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Only render when open and a package is selected (after hooks have been initialized)
  if (!isOpen || !selectedPackage) return null;

  // Get display amount and icon based on selected package
  const displayAmount = selectedPackage?.name?.includes('X1.5') ? '1.5X' : '2X';
  const stepBoostId = selectedPackage?.name?.includes('X1.5') ? 1 : 2;
  const stepBoostIcon = stepBoostAssets[stepBoostId]?.icon || iconStepBoostx1_5;

  return (
    <div className="step-boosts-popup-overlay" onClick={onClose}>
      <div
        className={`step-boosts-popup ${confirmed ? 'confirmed' : ''}`}
        ref={popupRef}
        style={
          fixedHeight || fixedWidth
            ? {
                height: fixedHeight,
                minHeight: fixedHeight,
                maxHeight: fixedHeight,
                width: fixedWidth,
                minWidth: fixedWidth,
                maxWidth: fixedWidth,
                boxSizing: 'border-box',
                overflow: 'hidden',
              }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
      >

    {!confirmed ? (
    <>
        {/* Corner borders */}
        <div className="mk-corner mk-top-left"></div>
        <div className="mk-corner mk-top-right"></div>
        <div className="mk-corner mk-bottom-left"></div>
        <div className="mk-corner mk-bottom-right"></div>
        {/* Body: header + content grouped */}
        <div className="step-boosts-body">
          {/* Header: show only one icon for the selected step boost */}

          <div className="step-boosts-header">
            <div className="step-boosts-icons">
              <img
                src={stepBoostIcon}
                alt={`${displayAmount} Step Boost icon`}
                className="step-boosts-icon"
              />
            </div>
          </div>

          
          {/* Content area */}
          <div className="step-boosts-content">
            <div className="step-boosts-message">
                <div className="step-boosts-line step-boosts-line-top">ACTIVATE BOOST</div>
                <div className="step-boosts-line step-boosts-line-top">AND MULTIPLY</div>
                <div className="step-boosts-line step-boosts-line-top">YOUR STARLET</div>
                <div className="step-boosts-line step-boosts-line-top">CLAIM TODAY</div>
            </div>
          </div>
        </div>
    </>
     ) : 
     <>
         {/* Background image with floating coins */}
         <div className="step-boosts-purchased-bg">
             <img 
                 src={stepBoostsPurchasedBg} 
                 alt="Floating coins background" 
                 className="step-boosts-bg-image"
             />
         </div>
         
        <div className="mk-corner mk-top-left-purchased"></div>
        <div className="mk-corner mk-top-right-purchased"></div>
        <div className="mk-corner mk-bottom-left-purchased"></div>
        <div className="mk-corner mk-bottom-right-purchased"></div>
         <div className="step-boosts-body">
             <div className="step-boosts-content">
                 <div className="step-boosts-purchased-message">
                     <div className="step-boosts-purchased-main">{displayAmount}</div>
                     <div className="step-boosts-purchased-sub">MULTIPLIER</div>
                     <div className="step-boosts-purchased-sub">PURCHASED!</div>
                 </div>
             </div>
         </div>
     </>
    }
        
        {/* Action buttons */}
        <div className="step-boosts-actions">
          {!confirmed ? (
            <>
              {/* Pay button */}
              <div className="step-boosts-pay-button">
                <span className="pay-text">PAY</span>
                <span className="pay-amount">{selectedPackage.starlet?.toLocaleString()}</span>
                <img className="pay-icon" src={starletIcon} alt="Starlets" />
              </div>
              
              <button className="step-boosts-no-thanks" onClick={handleNoThanks}>
                NO THANKS
              </button>
              <button 
                className="step-boosts-yes" 
                onClick={handlePurchase}
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : 'BUY'}
              </button>
            </>
          ) : (
            <button className="step-boosts-yes step-boosts-back-button" onClick={onClose}>
              BACK TO MARKET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepBoostsPopup;
