import React, { useEffect, useState, useRef } from 'react';
import './FreezeStreakPopup.css';
import iconStreak1 from './images/Icon_streak_1_day.png';
import iconStreak2 from './images/Icon_streak_2_day.png';
import iconStreak5 from './images/Icon_streak_5_day.png';
import starletIcon from './images/starlet.png';
import popFreeze1 from './images/Icon_streak_1_day.png';
import popFreeze2 from './images/icon_pop_freeze2.png';
import popFreeze5 from './images/icon_pop_freeze5.png';
import shared from './Shared';

const FreezeStreakPopup = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onPurchase,
  refreshStarletProduct,
  refreshUserProfile
}) => {
  // Freeze streak assets mapping based on num value
  const getFreezeAssets = (num) => {
    if (num === 1) {
      return { icon: popFreeze1 };
    } else if (num > 4) {
      return { icon: popFreeze5 };
    } else if (num > 1) {
      return { icon: popFreeze2 };
    } else {
      // Fallback to 1 day assets for any other values
      return { icon: popFreeze1 };
    }
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

  const handlePurchase = () => {
    onPurchase(selectedPackage);
    onClose();
  };

  const handleNoThanks = () => {
    onClose();
  };

  const handleClose = async () => {
    // If purchase was successful (confirmed = true), refresh the product data
    if (confirmed && selectedPackage?.productId && refreshStarletProduct) {
      console.log('FreezeStreakPopup: Refreshing product data after successful purchase');
      await refreshStarletProduct(selectedPackage.productId);
    }
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
        
        // Call onPurchase which will refresh user profile and update UI
        await onPurchase(selectedPackage);
        setConfirmed(true);
        
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
            
            // Call onPurchase which will refresh user profile and update UI
            await onPurchase(selectedPackage);
            setConfirmed(true);
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

  return (
    <div className="freeze-streak-popup-overlay" onClick={handleClose}>
      <div
        className={`freeze-streak-popup ${confirmed ? 'confirmed' : ''}`}
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
        {/* Corner borders */}
        <div className="mk-corner mk-top-left"></div>
        <div className="mk-corner mk-top-right"></div>
        <div className="mk-corner mk-bottom-left"></div>
        <div className="mk-corner mk-bottom-right"></div>
        {/* Body: header + content grouped */}
        <div className="freeze-streak-body">
          {/* Header: show icon and day text */}
          <div className="freeze-streak-header">
            <div className={`freeze-streak-icons ${selectedPackage.days > 4 ? 'freeze-streak-5' : ''}`}>
              <img
                src={getFreezeAssets(selectedPackage.days).icon}
                alt={`Freeze ${selectedPackage.days} day icon`}
                className="freeze-pop-icon"
              />
            </div>
            <div className={`freeze-streak-number ${selectedPackage.days > 4 ? 'freeze-streak-5' : ''}`}>{selectedPackage.days}</div>
            <div className={`freeze-streak-day-text ${selectedPackage.days > 4 ? 'freeze-streak-5' : ''}`}>DAY</div>
          </div>
          
          {/* Content area */}
          <div className="freeze-streak-content">
            <div className="freeze-streak-message">
              {!confirmed ? (
                <>
                  <div className="freeze-line freeze-line-top">PROTECT YOUR</div>
                  <div className="freeze-line freeze-line-mid">{selectedPackage.days}</div>
                  <div className="freeze-line freeze-line-bottom">DAY STREAK</div>
                </>
              ) : (
                <div className="freeze-line freeze-line-mid freeze-purchased-text">PURCHASED +{selectedPackage.days}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="freeze-streak-actions">
          {!confirmed ? (
            <>
              <div className="freeze-streak-pay-button">
                <span className="pay-text">PAY</span>
                <span className="pay-amount">{selectedPackage.price.toLocaleString()}</span>
                <img className="pay-icon" src={starletIcon} alt="Starlets" />
              </div>
              <button className="freeze-streak-no-thanks" onClick={handleNoThanks}>
                NO THANKS
              </button>
              <button 
                className="freeze-streak-yes" 
                onClick={handleConfirmAndPay}
                disabled={isProcessing}
              >
                {isProcessing ? 'PROCESSING...' : 'YES'}
              </button>
            </>
          ) : (
            <button className="freeze-streak-yes freeze-back-button" onClick={handleClose}>
              BACK TO MARKET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreezeStreakPopup;
