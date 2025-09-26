import React from 'react';
import './ConfirmClaimReward.css';
import starlet from './images/starlet.png';
import premiumDiamond from './images/Premium_icon_unlocked.png';

const ConfirmClaimReward = ({ isOpen, onClose, onConfirm, reward }) => {
  if (!isOpen || !reward) return null;

  return (
<div className="ccr-popup-overlay">
      <div className="ccr-popup-container">
        {/* Main Content */}
        <div className="ccr-main-content">
          {/* Diamond Container */}
          <div className="ccr-popup-purchased">
            <div className="ccr-corner ccr-top-left-purchased"></div>
            <div className="ccr-corner ccr-top-right-purchased"></div>
            <div className="ccr-corner ccr-bottom-left-purchased"></div>
            <div className="ccr-corner ccr-bottom-right-purchased"></div>

             <div className="ccr-body">
               <div className="ccr-content">
                 <div className="ccr-purchased-message">
                   <div className="ccr-purchased-main">
                     <img 
                       src={premiumDiamond} 
                       alt="Premium Diamond" 
                       className="ccr-diamond-img"
                     />
                   </div>
                 </div>
               </div>
             </div>
          </div>

          {/* Content Section */}
          <div className="ccr-content-section">
            <div className="confirm-claim-title">PREMIUM REWARDS</div>
            <div className="ccr-message">
              <div className="ccr-highlight">KEEP IT UP!</div>
              <div className="ccr-text">YOUR STEPS ARE PAYING OFF</div>
              <div className="ccr-text">YOU'VE REACHED THE NEXT</div>
              <div className="ccr-text">MILESTONE AND EARNED:</div>
            </div>
            
            <div className="ccr-reward">
              <img src={reward.icon} alt="Reward Icon" className="ccr-reward-icon" />
              <div className="ccr-quantity">{reward.quantity}</div>
            </div>
            
            <div className="ccr-reward-name">
              {reward.type === 'BANK STEPS' ? 'STARLETS' :
               reward.type === 'FREEZE STREAK' ? 'FREEZE STREAK' :
               reward.type === 'STEP BOOST' ? '1.5 STEP BOOST' :
               reward.type === 'SGC TOKENS' ? 'SGC TOKENS' :
               reward.type}
            </div>
            
            <div className="ccr-encourage">
              <div className="ccr-text">STAY ACTIVE TO UNLOCK</div>
              <div className="ccr-text">EVEN MORE REWARDS!</div>
            </div>
            
            <button className="ccr-claim-button" onClick={onConfirm}>
              CLAIM REWARDS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmClaimReward;


//  {/* Header */}
//  <div className="confirm-claim-header">
//  <div className="confirm-claim-title">PREMIUM REWARDS</div>
// </div>

// {/* Content */}
// <div className="confirm-claim-content">
//  <div className="confirm-claim-message">
//    <div className="confirm-claim-highlight">KEEP IT UP!</div>
//    <div className="confirm-claim-text">YOUR STEPS ARE PAYING OFF</div>
//    <div className="confirm-claim-text">YOU'VE REACHED THE NEXT</div>
//    <div className="confirm-claim-text">MILESTONE AND EARNED:</div>
//  </div>
 
//  <div className="confirm-claim-reward">
//    <img src={reward.icon} alt="Reward Icon" className="confirm-claim-reward-icon" />
//    <div className="confirm-claim-quantity">{reward.quantity}</div>
//  </div>
 
//  <div className="confirm-claim-reward-name">{reward.type}</div>
 
//  <div className="confirm-claim-encourage">
//    <div className="confirm-claim-text">STAY ACTIVE TO UNLOCK</div>
//    <div className="confirm-claim-text">EVEN MORE REWARDS!</div>
//  </div>
// </div>

// {/* Button */}
// <button className="confirm-claim-btn" onClick={onConfirm}>
//  CLAIM REWARDS
// </button>