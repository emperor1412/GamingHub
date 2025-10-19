import React from 'react';
import './ChallengeClaimReward.css';
import backIcon from './images/back.svg';
import starlet from './images/starlet.png';
import badge_incatrail from './images/badge_incatrail.png';
import ChallengeClaimedScreen from './ChallengeClaimedScreen';

const ChallengeClaimReward = ({ 
  challengeData, 
  onClaimRewards, 
  onBack 
}) => {
  const [showClaimedScreen, setShowClaimedScreen] = React.useState(false);
  
  // Debug state
  React.useEffect(() => {
    console.log('showClaimedScreen state:', showClaimedScreen);
  }, [showClaimedScreen]);
  
  const {
    stepsCompleted = 56000,
    distanceKm = 11,
    badgeName = "TRAILBLAZER OF MACHU PICCHU",
    challengeTitle = "INCA TRAIL",
    starletsReward = 400,
    challengeEndDate = "DD/MM/YY HH:MM",
    description = "Your path through challenges, discoveries and untold wonders has earned you the title of",
    location = "Peru"
  } = challengeData || {};

  const handleClaimRewards = () => {
    console.log('Claim rewards button clicked!');
    
    // Show the claimed screen first
    console.log('Setting showClaimedScreen to true');
    setShowClaimedScreen(true);
    
    // Don't call onClaimRewards immediately - let user see the claimed screen first
    // onClaimRewards will be called when they close the claimed screen
  };
  
  const handleCloseClaimedScreen = () => {
    console.log('Closing claimed screen');
    setShowClaimedScreen(false);
    
    // Now call onClaimRewards after showing the claimed screen
    if (onClaimRewards) {
      onClaimRewards();
    }
    
    // Navigate back to previous screen
    if (onBack) {
      onBack();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="challenge-claim-reward-container">
      {/* Background Pattern */}
      <div className="ccr-background-pattern"></div>
      
      {/* Main Content */}
      <div className="ccr-main-content">
        {/* Congratulatory Section */}
        <div className="ccr-congratulations-section">
          <div className="ccr-you-did-it">YOU DID IT!</div>
          <div className="ccr-congratulations-box">
            <span>CONGRATULATIONS!</span>
          </div>
          <div className="ccr-trail-description">STEP BY STEP, YOU CONQUERED</div>
          <div className="ccr-trail-description">THE LEGENDARY {challengeTitle.toUpperCase()}!</div>
          </div>

        {/* Steps Completed Section */}
        <div className="ccr-steps-section">
          <div className="ccr-steps-number">{stepsCompleted.toLocaleString()}</div>
          <div className="ccr-steps-label">STEPS COMPLETED</div>
          <div className="ccr-distance-info">{distanceKm} KM CONQUERED</div>
        </div>

        {/* Title & Badge Section */}
        <div className="ccr-title-section">
          <div className="ccr-title-description">{description}</div>
          
          <div className="ccr-title-box">
            <span>{`Trailblazer of ${challengeTitle}`}</span>
          </div>

        </div>

        {/* Reward Details Section */}
        <div className="ccr-reward-section">
          {/* Corner Decorations */}
          <div className="ccr-corner ccr-top-left"></div>
          <div className="ccr-corner ccr-top-right"></div>
          <div className="ccr-corner ccr-bottom-left"></div>
          <div className="ccr-corner ccr-bottom-right"></div>
          
          {/* Floating Starlets */}
          <div className="ccr-floating-starlets">
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s1" />
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s2" />
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s3" />
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s4" />
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s5" />
            <img src={starlet} alt="Floating Starlet" className="ccr-floating-starlet s6" />
          </div>
          
          <div className="ccr-badge-message">YOUR BADGE AWAITS!</div>
          <div className="ccr-badge-submessage">A symbol of your determination!</div>
          
          <div className="ccr-badge-message">CLAIM DOUBLE STARLETS</div>
          <div className="ccr-badge-submessage">Hard work always pays off!</div>

          {/* Claim Rewards Button */}
          <button className="ccr-claim-button" onClick={handleClaimRewards}>
            CLAIM REWARDS
          </button>
        </div>
      </div>
      
      {/* Challenge Claimed Screen */}
      {showClaimedScreen && (
        <ChallengeClaimedScreen 
          onClose={handleCloseClaimedScreen}
          claimedRewards={{
            starlets: starletsReward,
            badgeName: badgeName
          }}
        />
      )}
    </div>
  );
};

export default ChallengeClaimReward;
