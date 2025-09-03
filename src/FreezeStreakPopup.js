import React from 'react';
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
            <div className="freeze-line freeze-line-top">PROTECT YOUR</div>
            <div className="freeze-line freeze-line-mid">{'<'}{selectedPackage.days}{'>'}</div>
            <div className="freeze-line freeze-line-bottom">DAY STREAK</div>
          </div>
 
          {/* Pay button */}
          <button className="freeze-streak-pay-button" onClick={handlePurchase}>
            <span className="pay-text">PAY</span>
            <span className="pay-amount">{selectedPackage.price.toLocaleString()}</span>
            <img className="pay-icon" src={starletIcon} alt="Starlets" />
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
