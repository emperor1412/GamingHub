import React from 'react';
import './FreezeStreakPopup.css';
import iconStreak1 from './images/Icon_streak_1_day.png';
import iconStreak2 from './images/Icon_streak_2_day.png';
import iconStreak5 from './images/Icon_streak_5_day.png';

const FreezeStreakPopup = ({ 
  isOpen, 
  onClose, 
  selectedPackage, 
  onPurchase 
}) => {
  if (!isOpen || !selectedPackage) return null;

  // Freeze streak assets mapping
  const freezeAssets = {
    1: { icon: iconStreak1 },
    2: { icon: iconStreak2 },
    5: { icon: iconStreak5 },
  };

  const handlePurchase = () => {
    onPurchase(selectedPackage);
    onClose();
  };

  const handleNoThanks = () => {
    onClose();
  };

  const handleYes = () => {
    onPurchase(selectedPackage);
    onClose();
  };

  return (
    <div className="freeze-streak-popup-overlay" onClick={onClose}>
      <div className="freeze-streak-popup" onClick={(e) => e.stopPropagation()}>
        {/* Header with tilted 1 DAY */}
        <div className="freeze-streak-header">
          <div className="freeze-streak-hexagon">
            <img 
              src={freezeAssets[selectedPackage.days]?.icon || iconStreak1} 
              alt={`Freeze ${selectedPackage.days} day icon`}
              className="freeze-streak-snowflake"
            />
          </div>
          <div className="freeze-streak-day-display">
            <div className="freeze-streak-number">{selectedPackage.days}</div>
            <div className="freeze-streak-day-text">DAY</div>
          </div>
        </div>
        
        {/* Content area */}
        <div className="freeze-streak-content">
          <div className="freeze-streak-title">FREEZE STR</div>
          <div className="freeze-streak-message">
            PROTECT YOUR {selectedPackage.days} DAY STREAK
          </div>
          
          {/* Freeze options */}
          <div className="freeze-streak-options">
            <div className="freeze-option">
              <div className="freeze-option-icon">❄️</div>
              <div className="freeze-option-text">FREEZE {selectedPackage.days} DAY</div>
            </div>
            <div className="freeze-option">
              <div className="freeze-option-icon">❄️</div>
              <div className="freeze-option-text">FREEZE {selectedPackage.days * 2} DAYS</div>
            </div>
          </div>
          
          {/* Pay button */}
          <button className="freeze-streak-pay-button" onClick={handlePurchase}>
            <span className="pay-text">PAY</span>
            <span className="pay-amount">{selectedPackage.price.toLocaleString()}</span>
            <span className="pay-icon">⭐</span>
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="freeze-streak-actions">
          <button className="freeze-streak-no-thanks" onClick={handleNoThanks}>
            NO THANKS
          </button>
          <button className="freeze-streak-yes" onClick={handleYes}>
            YES
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreezeStreakPopup;
