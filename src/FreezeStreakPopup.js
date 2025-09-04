import React, { useEffect, useState, useRef } from 'react';
import './FreezeStreakPopup.css';
import iconStreak1 from './images/Icon_streak_1_day.png';
import iconStreak2 from './images/Icon_streak_2_day.png';
import iconStreak5 from './images/Icon_streak_5_day.png';
import starletIcon from './images/starlet.png';
import popFreeze1 from './images/icon_pop_freeze1.png';
import popFreeze2 from './images/icon_pop_freeze2.png';
import popFreeze5 from './images/icon_pop_freeze5.png';

const FreezeStreakPopup = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onPurchase 
}) => {
  // Freeze streak assets mapping
  const freezeAssets = {
    1: { icon: iconStreak1 },
    2: { icon: iconStreak2 },
    5: { icon: iconStreak5 },
  };

  // Track confirmation after clicking YES
  const [confirmed, setConfirmed] = useState(false);
  // Preserve popup size when confirming so it doesn't change
  const popupRef = useRef(null);
  const [fixedHeight, setFixedHeight] = useState(null);
  const [fixedWidth, setFixedWidth] = useState(null);

  // Reset confirmation only when popup opens/closes
  useEffect(() => {
    if (isOpen) {
      setConfirmed(false);
      setFixedHeight(null);
      setFixedWidth(null);
    }
  }, [isOpen]);

  const handlePurchase = () => {
    onPurchase(selectedPackage);
    onClose();
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

  // Only render when open and a package is selected (after hooks have been initialized)
  if (!isOpen || !selectedPackage) return null;

  return (
    <div className="freeze-streak-popup-overlay" onClick={onClose}>
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
          {/* Header: show only one icon for the selected day */}
          <div className="freeze-streak-header">
            <div className="freeze-streak-icons">
              <img
                src={{ 1: popFreeze1, 2: popFreeze2, 5: popFreeze5 }[selectedPackage.days] || popFreeze1}
                alt={`Freeze ${selectedPackage.days} day icon`}
                className="freeze-pop-icon"
              />
            </div>
          </div>
          
          {/* Content area */}
          <div className="freeze-streak-content">
            <div className="freeze-streak-message">
              {!confirmed ? (
                <>
                  <div className="freeze-line freeze-line-top">PROTECT YOUR</div>
                  <div className="freeze-line freeze-line-mid">{'<'}{selectedPackage.days}{'>'}</div>
                  <div className="freeze-line freeze-line-bottom">DAY STREAK</div>
                </>
              ) : (
                <div className="freeze-line freeze-line-mid freeze-purchased-text">PURCHASED +{selectedPackage.days}</div>
              )}
            </div>

            {/* Pay button */}
            {!confirmed && (
              <div className="freeze-streak-pay-button">
                <span className="pay-text">PAY</span>
                <span className="pay-amount">{selectedPackage.price.toLocaleString()}</span>
                <img className="pay-icon" src={starletIcon} alt="Starlets" />
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="freeze-streak-actions">
          {!confirmed ? (
            <>
              <button className="freeze-streak-no-thanks" onClick={handleNoThanks}>
                NO THANKS
              </button>
              <button className="freeze-streak-yes" onClick={handleYes}>
                YES
              </button>
            </>
          ) : (
            <button className="freeze-streak-yes freeze-back-button" onClick={onClose}>
              BACK TO MARKET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreezeStreakPopup;
