import React, { useState, useEffect } from 'react';
import './Premium.css';
import back from './images/back.svg';
import premiumDiamond from './images/Premium_icon.png';
import starlet from './images/starlet.png';

const Premium = ({ isOpen, onClose = 0 }) => {

  const [currentXP, setCurrentXP] = useState(0);

  // Set XP ban đầu khi component mount
  useEffect(() => {
    setCurrentXP(2233);
  }, []);

  // Dữ liệu XP cho từng level
  const levelData = [
    { level: 1, xpNeeded: 120, cumulativeXP: 120 },
    { level: 2, xpNeeded: 120, cumulativeXP: 240 },
    { level: 3, xpNeeded: 360, cumulativeXP: 600 },
    { level: 4, xpNeeded: 420, cumulativeXP: 1020 },
    { level: 5, xpNeeded: 460, cumulativeXP: 1480 },
    { level: 6, xpNeeded: 480, cumulativeXP: 1960 },
    { level: 7, xpNeeded: 500, cumulativeXP: 2460 },
    { level: 8, xpNeeded: 520, cumulativeXP: 2980 },
    { level: 9, xpNeeded: 540, cumulativeXP: 3520 },
    { level: 10, xpNeeded: 560, cumulativeXP: 4080 },
    { level: 11, xpNeeded: 570, cumulativeXP: 4650 },
    { level: 12, xpNeeded: 570, cumulativeXP: 5220 }
  ];

  // Tính level hiện tại dựa trên XP
  const getCurrentLevel = () => {
    for (let i = levelData.length - 1; i >= 0; i--) {
      if (currentXP >= levelData[i].cumulativeXP) {
        return i + 1;
      }
    }
    return 1;
  };
  
  const currentLevel = getCurrentLevel();
  
  // Tính progress percentage dựa trên XP hiện tại
  const getProgressPercentage = () => {
    if (currentXP >= 5220) return 100; // Max level
    
    const currentLevelIndex = currentLevel - 1;
    const currentLevelStartXP = currentLevelIndex > 0 ? levelData[currentLevelIndex - 1].cumulativeXP : 0;
    const currentLevelEndXP = levelData[currentLevelIndex].cumulativeXP;
    const currentLevelProgress = (currentXP - currentLevelStartXP) / (currentLevelEndXP - currentLevelStartXP);
    
    return ((currentLevelIndex + currentLevelProgress) / 12) * 100;
  };
  
  if (!isOpen) return null;

  return (
    <div className="premium-overlay">
      <div className="premium-container">
        {/* Corner borders */}
        <div className="premium-corner premium-top-left"></div>
        <div className="premium-corner premium-top-right"></div>
        <div className="premium-corner premium-bottom-left"></div>
        <div className="premium-corner premium-bottom-right"></div>
        
        {/* Back Button */}
        <button className="premium-back-btn" onClick={onClose}>
          <img src={back} alt="Back" />
        </button>
        
        {/* Header */}
        <div className="premium-header">
            <img src={premiumDiamond} alt="Premium Diamond" className="premium-diamond-img" />
          <div className="premium-title">
            <span className="premium-title-line">PREMIUM</span>
            <span className="premium-title-line">REWARDS</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="premium-progress">
          <div className="premium-progress-bar">
            <div className="premium-progress-fill" style={{width: `${getProgressPercentage()}%`}}></div>
            {/* Segment dividers */}
            {Array.from({ length: 11 }, (_, index) => (
              <div 
                key={index}
                className="premium-segment-divider"
                style={{left: `${((index + 1) / 12) * 100}%`}}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Level Labels */}
        <div className="premium-level-labels">
          <div className="premium-level">LEVEL 1</div>
          <div className="premium-level">LEVEL 12</div>
        </div>
        
        {/* Rewards List */}
        <div className="premium-rewards">
          <div className="premium-reward-item">
            <div className="premium-reward-item-left">
              <span className="premium-reward-number">1</span>
              <span className="premium-reward-text">BANK 500 STEPS</span>
            </div>
            <div className="premium-reward-item-right">
              <div className="premium-status-group">
                <img src={premiumDiamond} alt="Status Icon" className="premium-status-icon" />
                <span className="premium-reward-status">CLAIMED</span>
              </div>
              <img src={starlet} alt="Reward Icon" className="premium-reward-icon" />
              <span className="premium-reward-quantity">600</span>
            </div>
          </div>
          <div className="premium-reward-item">
            <div className="premium-reward-item-left">
              <span className="premium-reward-number">2</span>
              <span className="premium-reward-text">BANK 500 STEPS</span>
            </div>
            <div className="premium-reward-item-right">
              <div className="premium-status-group">
              <img src={premiumDiamond} alt="Status Icon" className="premium-status-icon" />
                <span className="premium-reward-status">UNLOCKED</span>
              </div>
              <img src={starlet} alt="Reward Icon" className="premium-reward-icon" />
              <span className="premium-reward-quantity">600</span>
            </div>
          </div>
          <div className="premium-reward-item">
            <div className="premium-reward-item-left">
              <span className="premium-reward-number">3</span>
              <span className="premium-reward-text">BANK 500 STEPS</span>
            </div>
            <div className="premium-reward-item-right">
              <div className="premium-status-group">
              <img src={premiumDiamond} alt="Status Icon" className="premium-status-icon" />
                <span className="premium-reward-status">LOCKED</span>
              </div>
              <img src={starlet} alt="Reward Icon" className="premium-reward-icon" />
              <span className="premium-reward-quantity">600</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="premium-footer">
          <div className="premium-time-remaining">20 DAYS REMAINING</div>
          <button className="premium-renew-btn">RENEW</button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
