import React, { useState, useEffect } from 'react';
import './Premium.css';
import back from './images/back.svg';
import premiumDiamond from './images/Premium_icon.png';
import unlockIcon from './images/unlock.png';
import lockIcon from './images/lock_icon.png';
import ConfirmClaimReward from './ConfirmClaimReward';
import shared from './Shared';
import iconStepBoostReward from './images/StepBoosts_Icon_Reward.png';

const Premium = ({ isOpen, onClose = 0 }) => {

  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isMembership, setIsMembership] = useState(false);
  const [endTime, setEndTime] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapping reward types from API to display format
  const getRewardTypeInfo = (type) => {
    switch(type) {
      case 10020: // STARLETS/BANK STEPS
        return {
          type: 'BANK STEPS',
          description: shared.mappingText[type] || 'BANK STEPS',
          icon: shared.mappingIcon[type]
        };
      case 10110: // FREEZE STREAK
        return {
          type: 'FREEZE STREAK', 
          description: shared.mappingText[type] || 'FREEZE STREAK',
          icon: shared.mappingIcon[type]
        };
      case 10120: // STEP BOOST 1.5x
        return {
          type: 'STEP BOOST',
          description: shared.mappingText[type] || '1.5X BOOST STEPS', 
          icon: shared.mappingIcon[type]
        };
      case 10121: // STEP BOOST 2x
        return {
          type: 'STEP BOOST',
          description: shared.mappingText[type] || '2X BOOST STEPS', 
          icon: iconStepBoostReward
        };
      case 10030: // SGC TOKENS
        return {
          type: 'SGC TOKENS',
          description: shared.mappingText[type] || 'SGC TOKENS',
          icon: shared.mappingIcon[type]
        };
      default:
        return {
          type: 'UNKNOWN',
          description: 'UNKNOWN REWARD',
          icon: shared.mappingIcon[10020] // fallback to starlet icon
        };
    }
  };

  // OLD PREMIUM REWARDS DATA (COMMENTED OUT - NOW USING API DATA)
  // const initialRewards = [
  //   // Group 1: BANK STEPS (Levels 1-3)
  //   { level: 1, type: 'BANK STEPS', description: 'BANK 500 STEPS', quantity: 600, status: 'CLAIMED', icon: starlet },
  //   { level: 2, type: 'BANK STEPS', description: 'BANK 500 STEPS', quantity: 600, status: 'UNLOCKED', icon: starlet },
  //   { level: 3, type: 'BANK STEPS', description: 'BANK 500 STEPS', quantity: 600, status: 'LOCKED', icon: starlet },
  //   
  //   // Group 2: FREEZE STREAK (Levels 4-6)
  //   { level: 4, type: 'FREEZE STREAK', description: 'FREEZE STREAK', quantity: 1, status: 'UNLOCKED', icon: freezeStreak },
  //   { level: 5, type: 'FREEZE STREAK', description: 'FREEZE STREAK', quantity: 1, status: 'CLAIMED', icon: freezeStreak },
  //   { level: 6, type: 'FREEZE STREAK', description: 'FREEZE STREAK', quantity: 1, status: 'LOCKED', icon: freezeStreak },
  //   
  //   // Group 3: STEP BOOST (Levels 7-9)
  //   { level: 7, type: 'STEP BOOST', description: '1.5 STEP BOOST', quantity: 1, status: 'LOCKED', icon: stepBoost },
  //   { level: 8, type: 'STEP BOOST', description: '1.5 STEP BOOST', quantity: 1, status: 'CLAIMED', icon: stepBoost },
  //   { level: 9, type: 'STEP BOOST', description: '1.5 STEP BOOST', quantity: 1, status: 'UNLOCKED', icon: stepBoost },
  //   
  //   // Group 4: SGC TOKENS (Levels 10-12)
  //   { level: 10, type: 'SGC TOKENS', description: '1000 SGC TOKENS', quantity: 3, status: 'UNLOCKED', icon: bCoin },
  //   { level: 11, type: 'SGC TOKENS', description: '1000 SGC TOKENS', quantity: 3, status: 'LOCKED', icon: bCoin },
  //   { level: 12, type: 'SGC TOKENS', description: '1000 SGC TOKENS', quantity: 3, status: 'CLAIMED', icon: bCoin },
  // ];


  // Fetch premium data from API
  const fetchPremiumData = async () => {
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for premium data API');
        setLoading(false);
        return;
      }
      
      const url = `${shared.server_url}/api/app/getPremiumDetail?token=${shared.loginData.token}`;
      console.log('Fetching premium data from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Premium data API response:', data);
        
        if (data.code === 0 && data.data) {
          const premiumData = data.data;
          
          // Set basic info
          setCurrentXP(premiumData.exp || 0);
          setCurrentLevel(premiumData.level || 0);
          setIsMembership(premiumData.isMembership || false);
          setEndTime(premiumData.endTime || 0);
          
          // Process rewards - NOW HANDLES MULTIPLE REWARDS PER LEVEL
          if (premiumData.rewards && Array.isArray(premiumData.rewards)) {
            const processedRewards = premiumData.rewards.map(rewardLevel => {
              if (rewardLevel.list && rewardLevel.list.length > 0) {
                // Process each reward in the list
                const rewards = rewardLevel.list.map(rewardItem => {
                  const typeInfo = getRewardTypeInfo(rewardItem.type);
                  
                  return {
                    level: rewardLevel.level,
                    type: typeInfo.type,
                    description: typeInfo.description,
                    quantity: rewardItem.amount,
                    icon: typeInfo.icon,
                    claimStatus: rewardLevel.claimStatus,
                    rewardType: rewardItem.type
                  };
                });
                
                return {
                  level: rewardLevel.level,
                  claimStatus: rewardLevel.claimStatus,
                  rewards: rewards
                };
              }
              return null;
            }).filter(reward => reward !== null);
            
            setRewards(processedRewards);
            console.log('✅ Processed rewards with multiple items per level:', processedRewards);
          }
        } else {
          console.log('Unexpected premium data API response format:', data);
        }
      } else {
        console.error('Premium data API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error fetching premium data:', error);
    } finally {
      setLoading(false);
    }
  };

  // FAKE DATA FOR TESTING - Keep for testing purposes
  const fetchPremiumDataFake = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // FAKE DATA with multiple rewards per level
      const fakeData = {
        "code": 0,
        "data": {
          "isMembership": true,
          "endTime": 1761868799000,
          "level": 5,
          "exp": 1200,
          "type": 1,
          "rewards": [
            { "level": 1, "claimStatus": true, "list": [{ "level": 1, "type": 10020, "amount": 500 }] },
            { "level": 2, "claimStatus": true, "list": [{ "level": 2, "type": 10020, "amount": 600 }] },
            { "level": 3, "claimStatus": false, "list": [{ "level": 3, "type": 10020, "amount": 700 }] },
            { "level": 4, "claimStatus": false, "list": [{ "level": 4, "type": 10110, "amount": 1 }] },
            { "level": 5, "claimStatus": false, "list": [{ "level": 5, "type": 10120, "amount": 1 }] },
            { "level": 6, "claimStatus": false, "list": [{ "level": 6, "type": 10020, "amount": 800 }, { "level": 6, "type": 10110, "amount": 1 }] },
            { "level": 7, "claimStatus": false, "list": [{ "level": 7, "type": 10121, "amount": 1 }] },
            { "level": 8, "claimStatus": false, "list": [{ "level": 8, "type": 10030, "amount": 1000 }] },
            { "level": 9, "claimStatus": false, "list": [{ "level": 9, "type": 10020, "amount": 900 }, { "level": 9, "type": 10120, "amount": 1 }] },
            { "level": 10, "claimStatus": false, "list": [{ "level": 10, "type": 10030, "amount": 2000 }, { "level": 10, "type": 10110, "amount": 2 }] },
            { "level": 11, "claimStatus": false, "list": [{ "level": 11, "type": 10020, "amount": 1000 }, { "level": 11, "type": 10121, "amount": 1 }, { "level": 11, "type": 10030, "amount": 500 }] },
            { "level": 12, "claimStatus": false, "list": [{ "level": 12, "type": 10030, "amount": 5000 }, { "level": 12, "type": 10121, "amount": 2 }] },
            { "level": 13, "claimStatus": false, "list": [{ "level": 13, "type": 10020, "amount": 1200 }] },
            { "level": 14, "claimStatus": false, "list": [{ "level": 14, "type": 10110, "amount": 3 }] },
            { "level": 15, "claimStatus": false, "list": [{ "level": 15, "type": 10121, "amount": 2 }] },
            { "level": 16, "claimStatus": false, "list": [{ "level": 16, "type": 10030, "amount": 3000 }] },
            { "level": 17, "claimStatus": false, "list": [{ "level": 17, "type": 10020, "amount": 1500 }, { "level": 17, "type": 10110, "amount": 2 }] },
            { "level": 18, "claimStatus": false, "list": [{ "level": 18, "type": 10121, "amount": 3 }] },
            { "level": 19, "claimStatus": false, "list": [{ "level": 19, "type": 10030, "amount": 4000 }] },
            { "level": 20, "claimStatus": false, "list": [{ "level": 20, "type": 10020, "amount": 2000 }, { "level": 20, "type": 10121, "amount": 2 }, { "level": 20, "type": 10030, "amount": 1000 }] }
          ]
        }
      };
      
      console.log('Using FAKE premium data:', fakeData);
      
      const premiumData = fakeData.data;
      
      // Set basic info
      setCurrentXP(premiumData.exp || 0);
      setCurrentLevel(premiumData.level || 0);
      setIsMembership(premiumData.isMembership || false);
      setEndTime(premiumData.endTime || 0);
      
      // Process rewards - NOW HANDLES MULTIPLE REWARDS PER LEVEL
      if (premiumData.rewards && Array.isArray(premiumData.rewards)) {
        const processedRewards = premiumData.rewards.map(rewardLevel => {
          if (rewardLevel.list && rewardLevel.list.length > 0) {
            // Process each reward in the list
            const rewards = rewardLevel.list.map(rewardItem => {
              const typeInfo = getRewardTypeInfo(rewardItem.type);
              
              return {
                level: rewardLevel.level,
                type: typeInfo.type,
                description: typeInfo.description,
                quantity: rewardItem.amount,
                icon: typeInfo.icon,
                claimStatus: rewardLevel.claimStatus,
                rewardType: rewardItem.type
              };
            });
            
            return {
              level: rewardLevel.level,
              claimStatus: rewardLevel.claimStatus,
              rewards: rewards
            };
          }
          return null;
        }).filter(reward => reward !== null);
        
        setRewards(processedRewards);
        console.log('✅ Processed rewards with multiple items per level:', processedRewards);
      }
    } catch (error) {
      console.error('Error with fake premium data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate remaining time
  const getRemainingTime = () => {
    if (!endTime || endTime === 0) {
      return "NO ACTIVE MEMBERSHIP";
    }
    
    const now = Date.now(); // Current time in milliseconds
    const remaining = endTime - now; // endTime is already in milliseconds from API
    
    if (remaining <= 0) {
      return "MEMBERSHIP EXPIRED";
    }
    
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000)); // Convert to days
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)); // Convert to hours
    
    if (days > 0) {
      return `${days} DAY${days > 1 ? 'S' : ''} REMAINING`;
    } else if (hours > 0) {
      return `${hours} HOUR${hours > 1 ? 'S' : ''} REMAINING`;
    } else {
      return "LESS THAN 1 HOUR REMAINING";
    }
  };

  // Fetch premium data when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchPremiumData();
    }
  }, [isOpen]);

  // Function to claim reward and show popup
  const handleClaimReward = async (rewardIndex) => {
    if (rewards[rewardIndex].claimStatus || rewards[rewardIndex].level > currentLevel) return;
    
    const reward = rewards[rewardIndex];
    
    try {
      if (!shared.loginData?.token) {
        console.log('No login token available for claim reward API');
        return;
      }
      
      const url = `${shared.server_url}/api/app/claimPremiumRewards?level=${reward.level}&token=${shared.loginData.token}`;
      console.log('Claiming reward from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Claim reward API response:', data);
        
        if (data.code === 0 && data.data?.success) {
          // Update UI state to show as claimed
          setRewards(prevRewards => {
            const newRewards = [...prevRewards];
            newRewards[rewardIndex].claimStatus = true;
            return newRewards;
          });
          
          // Set reward data from API response for popup
          if (data.data.reward && data.data.reward.length > 0) {
            // Process all rewards from API response
            const processedRewards = data.data.reward.map(apiReward => {
              const typeInfo = getRewardTypeInfo(apiReward.type);
              return {
                level: apiReward.level,
                type: typeInfo.type,
                description: typeInfo.description,
                quantity: apiReward.amount,
                status: 'CLAIMED',
                icon: typeInfo.icon,
                rewardType: apiReward.type
              };
            });
            
            setSelectedReward({
              level: reward.level,
              claimStatus: true,
              rewards: processedRewards,
              index: rewardIndex
            });
            
            // Show success popup
            setShowConfirmPopup(true);
            console.log('✅ Reward claimed successfully!');
          }
        } else {
          console.error('Claim reward failed:', data.message || 'Unknown error');
        }
      } else {
        console.error('Claim reward API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  // Function to close claim popup
  const handleConfirmClaim = () => {
    setShowConfirmPopup(false);
    setSelectedReward(null);
  };

  // Function to close popup
  const handleClosePopup = () => {
    setShowConfirmPopup(false);
    setSelectedReward(null);
  };

  // Function to handle renew button click
  const handleRenew = () => {
    // Close premium popup first
    onClose();
    
    // Navigate to market/shop
    if (typeof shared.setActiveTab === 'function') {
      shared.setInitialMarketTab('starlet');
      shared.setActiveTab('market');
    } else {
      console.log('setActiveTab function not available');
    }
  };

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
  const calculateCurrentLevel = () => {
    for (let i = levelData.length - 1; i >= 0; i--) {
      if (currentXP >= levelData[i].cumulativeXP) {
        return i + 1;
      }
    }
    return 1;
  };
  
  const calculatedLevel = calculateCurrentLevel();
  
  // Tính progress percentage dựa trên XP hiện tại
  const getProgressPercentage = () => {
    if (currentXP >= 5220) return 100; // Max level
    
    const currentLevelIndex = calculatedLevel - 1;
    const currentLevelStartXP = currentLevelIndex > 0 ? levelData[currentLevelIndex - 1].cumulativeXP : 0;
    const currentLevelEndXP = levelData[currentLevelIndex].cumulativeXP;
    const currentLevelProgress = (currentXP - currentLevelStartXP) / (currentLevelEndXP - currentLevelStartXP);
    
    return ((currentLevelIndex + currentLevelProgress) / 12) * 100;
  };
  
  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="premium-overlay">
        <div className="premium-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            color: 'white',
            fontSize: '18px',
            fontFamily: '"PP Neue Machina", sans-serif'
          }}>
            Loading Premium Data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-overlay">
      <div className="premium-container">
        {/* Back Button - Hide when ConfirmClaimReward is open */}
        {!showConfirmPopup && (
          <button className="back-button back-button-alignment" onClick={onClose}>
            <img src={back} alt="Back" />
          </button>
        )}
        
        {/* Header */}
        <div className="premium-header">
          {/* Corner borders for header */}
          <div className="premium-corner premium-top-left"></div>
          <div className="premium-corner premium-top-right"></div>
          <div className="premium-corner premium-bottom-left"></div>
          <div className="premium-corner premium-bottom-right"></div>
          
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
        
        {/* Rewards List - Back to Original Design */}
        <div className="premium-rewards">
          {rewards.map((rewardLevel, levelIndex) => (
            <div 
              key={rewardLevel.level} 
              className={`premium-reward-item ${!rewardLevel.claimStatus && rewardLevel.level <= currentLevel ? 'premium-reward-clickable' : ''}`}
              onClick={() => !rewardLevel.claimStatus && rewardLevel.level <= currentLevel && handleClaimReward(levelIndex)}
            >
              <div className="premium-reward-item-left">
                <img 
                  src={rewardLevel.claimStatus ? premiumDiamond : 
                       (rewardLevel.level <= currentLevel ? unlockIcon : lockIcon)} 
                  alt="Status Icon" 
                  className={`premium-status-icon premium-status-icon-${rewardLevel.claimStatus ? 'diamond' : (rewardLevel.level <= currentLevel ? 'unlock' : 'lock')}`}
                />
                <span className="premium-reward-number">{rewardLevel.level}</span>
              </div>
              <div className="premium-reward-item-right">
                <div className="premium-reward-info">
                  {rewardLevel.rewards
                    .filter(reward => reward.quantity > 0) // Filter out rewards with quantity = 0
                    .map((reward, rewardIndex) => (
                      <div key={rewardIndex} className="premium-reward-item-info">
                        <span className="premium-reward-quantity">{reward.quantity}</span>
                        <img src={reward.icon} alt="Reward Icon" className="premium-reward-icon" />
                      </div>
                    ))}
                </div>
                <div className="premium-status-container">
                  <span className={`premium-reward-status premium-status-${rewardLevel.claimStatus ? 'claimed' : (rewardLevel.level <= currentLevel ? 'unlocked' : 'locked')}`}>
                    {rewardLevel.claimStatus ? 'CLAIMED' : (rewardLevel.level <= currentLevel ? 'UNLOCKED' : 'LOCKED')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="premium-footer">
          {/* Corner borders for header */}
          <div className="premium-corner premium-top-left"></div>
          <div className="premium-corner premium-top-right"></div>
          <div className="premium-corner premium-bottom-left"></div>
          <div className="premium-corner premium-bottom-right"></div>

          <div className="premium-time-remaining">{getRemainingTime()}</div>
          <button className="premium-renew-btn" onClick={handleRenew}>RENEW</button>
        </div>
      </div>
      
      {/* Confirm Claim Reward Popup */}
      <ConfirmClaimReward 
        isOpen={showConfirmPopup}
        onClose={handleClosePopup}
        onConfirm={handleConfirmClaim}
        reward={selectedReward}
      />
    </div>
  );
};

export default Premium;
