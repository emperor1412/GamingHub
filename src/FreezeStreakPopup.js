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

  const handleBackToMarket = () => {
    onClose();
  };

  return (
    <div className="freeze-streak-popup-overlay" onClick={onClose}>
      <div className="freeze-streak-popup" onClick={(e) => e.stopPropagation()}>
        <div className="freeze-streak-icon-container">
          <div className="freeze-streak-hexagon">
            <img 
              src={freezeAssets[selectedPackage.days]?.icon || iconStreak1} 
              alt={`Freeze ${selectedPackage.days} day icon`}
              className="freeze-streak-icon"
            />
          </div>
          <div className="freeze-streak-days">{selectedPackage.days} {selectedPackage.days === 1 ? 'DAY' : 'DAYS'}</div>
        </div>
        
        <div className="freeze-streak-purchased">
          PURCHASED +1
        </div>
        
        <div className="freeze-streak-price">
          {selectedPackage.price.toLocaleString()} Starlets
        </div>
        
        <button 
          className="freeze-streak-back-button"
          onClick={handleBackToMarket}
        >
          BACK TO MARKET
        </button>
      </div>
    </div>
  );
};

export default FreezeStreakPopup;
