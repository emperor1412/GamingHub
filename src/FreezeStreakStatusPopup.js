import React from 'react';
import './FreezeStreakStatusPopup.css';
import shared from './Shared';
import iconStreak1 from './images/Icon_streak_1_day.png';

const FreezeStreakStatusPopup = ({ 
  isOpen, 
  onClose, 
  onPurchaseAnother,
  missDay = 0,
  remainingFreezeStreaks = 0
}) => {
  if (!isOpen) return null;

  return (
    <div className="freeze-status-popup-overlay" onClick={onClose}>
      <div
        className="freeze-status-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner borders */}
        <div className="mk-corner mk-top-left"></div>
        <div className="mk-corner mk-top-right"></div>
        <div className="mk-corner mk-bottom-left"></div>
        <div className="mk-corner mk-bottom-right"></div>
        
        {/* Main content */}
        <div className="freeze-status-content">
          {/* Freeze Streak Icon */}
          <div className="freeze-status-icon">
            <img 
              src={iconStreak1} 
              alt="Freeze Streak Icon" 
              className="freeze-status-icon-img"
            />
          </div>
          
          {/* Freeze Streaks Used */}
          <div className="freeze-status-used">
            <div className="freeze-status-number">{missDay}</div>
            <div className="freeze-status-text">
              <div>FREEZE</div>
              <div>STREAKS</div>
              <div>USED</div>
            </div>
          </div>
          
          {/* Current Freeze Streaks */}
          <div className="freeze-status-current">
            <div className="freeze-status-small-icon">
              <img 
                src={iconStreak1} 
                alt="Freeze Streak Icon" 
                className="freeze-status-small-icon-img"
              />
            </div>
            <div className="freeze-status-current-text">
              FREEZE STREAKS: {remainingFreezeStreaks}
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="freeze-status-actions">
          <button className="freeze-status-close" onClick={onClose}>
            CLOSE
          </button>
          <button className="freeze-status-purchase" onClick={onPurchaseAnother}>
            PURCHASE ANOTHER
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreezeStreakStatusPopup;
