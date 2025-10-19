import React from 'react';
import './ChallengeClaimedScreen.css';
import badge_incatrail from './images/badge_incatrail.png';
import starlet from './images/starlet.png';

const ChallengeClaimedScreen = ({ 
  onClose,
  onViewBadges,
  claimedRewards = {}
}) => {
  return (
    <div className="ccs-container">
      {/* Background Pattern */}
      <div className="ccs-background-pattern"></div>
      
      {/* Main Content */}
      <div className="ccs-main-content">
        {/* YOU'VE RECEIVED Section */}
        <div className="ccs-received-section">
          <div className="ccs-received-box">
            YOU'VE RECEIVED
          </div>
        </div>

        {/* Reward Details */}
        <div className="ccs-reward-details">
          <div className="ccs-reward-text">
            {claimedRewards.starlets} STARLETS
          </div>
          <div className="ccs-reward-text">
            {claimedRewards.badgeName} 
          </div>
          <div className="ccs-reward-text">BADGE</div>
          
          {/* Corner Brackets */}
          <div className="ccs-corner ccs-top-left"></div>
          <div className="ccs-corner ccs-top-right"></div>
          <div className="ccs-corner ccs-bottom-left"></div>
          <div className="ccs-corner ccs-bottom-right"></div>
        </div>

        {/* Central Badge */}
        <div className="ccs-badge-container">
          <img 
            src={badge_incatrail} 
            alt="Inca Trail Badge" 
            className="ccs-badge-image"
          />
        </div>

        {/* Floating Stars */}
        <div className="ccs-floating-stars">
          <img src={starlet} alt="Star" className="ccs-star s1" />
          <img src={starlet} alt="Star" className="ccs-star s2" />
          <img src={starlet} alt="Star" className="ccs-star s3" />
          <img src={starlet} alt="Star" className="ccs-star s4" />
          <img src={starlet} alt="Star" className="ccs-star s5" />
          <img src={starlet} alt="Star" className="ccs-star s6" />
        </div>

        {/* VIEW BADGES Button */}
        <button className="ccs-view-badges-button" onClick={onViewBadges || onClose}>
          VIEW BADGES
        </button>
      </div>

    </div>
  );
};

export default ChallengeClaimedScreen;
