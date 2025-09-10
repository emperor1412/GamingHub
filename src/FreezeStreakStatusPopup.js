import React from 'react';
import './FreezeStreakStatusPopup.css';
import shared from './Shared';
import iconStreak1 from './images/Icon_streak_1_day.png';

const FreezeStreakStatusPopup = ({ 
  isOpen, 
  onClose, 
  onPurchaseAnother,
  missDay = 0,
  remainingFreezeStreaks = 0,
  useStreakFreeze = false
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
          {useStreakFreeze ? (
            // Freeze streak was used - show current design
            <>
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
                  FREEZE STREAKS: {remainingFreezeStreaks - missDay}
                </div>
              </div>
            </>
          ) : (
            // Streak is broken - show new design
            <>
              {/* You Missed X Days */}
              <div className="freeze-status-missed">
                <div className="freeze-status-missed-text">YOU MISSED</div>
                <div className="freeze-status-number freeze-status-missed">{missDay} DAYS</div>
              </div>
              
              {/* Freeze Streaks Used Info */}
              <div className="freeze-status-current freeze-status-missed-popup">
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
              
              {/* Streak is Broken */}
              <div className="freeze-status-broken">
                <div className="freeze-status-broken-text">STREAK IS</div>
                <div className="freeze-status-broken-text">BROKEN</div>
              </div>
            </>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="freeze-status-actions">
          <button className="freeze-status-close" onClick={onClose}>
            CLOSE
          </button>
          <button className="freeze-status-purchase" onClick={onPurchaseAnother}>
            {useStreakFreeze ? 'PURCHASE ANOTHER' : 'BUY MORE STREAKS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreezeStreakStatusPopup;
