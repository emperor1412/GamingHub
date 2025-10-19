import React, { useState } from 'react';
import './ChallengeJoinConfirmation.css';
import ChallengeUpdate from './ChallengeUpdate';
import shared from './Shared';
import challenges_robot from './images/challenges_robot.png';
import starlet from './images/starlet.png';
import trophy_4 from './images/trophy_4.png';

const ChallengeJoinConfirmation = ({ 
  challengeData, 
  onJoinChallenge, 
  onBack,
  onViewBadges
}) => {
  const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
  const {
    steps = 56000,
    days = 7,
    starletsCost = 200,
    badgeName = "EXPLORER BADGE",
    challengeEndDate = "DD/MM/YY HH:MM"
  } = challengeData || {};

  const handleJoinChallenge = () => {
    // Call the parent's join handler instead of directly showing ChallengeUpdate
    if (onJoinChallenge) {
      onJoinChallenge();
    }
  };

  const handleDoneFromUpdate = () => {
    setShowChallengeUpdate(false);
    if (onJoinChallenge) {
      onJoinChallenge();
    }
  };

  const handleBackFromUpdate = () => {
    setShowChallengeUpdate(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Show ChallengeUpdate if state is true
  if (showChallengeUpdate) {
    return (
      <ChallengeUpdate
        challengeData={challengeData}
        onDone={handleDoneFromUpdate}
        onBack={handleBackFromUpdate}
        onViewBadges={onViewBadges}
      />
    );
  }

  return (
    <div className="challenge-join-confirmation-container">
      {/* Background Pattern */}
      <div className="cjc-background-pattern"></div>
      
      {/* Main Content */}
      <div className="cjc-main-content">
        {/* Challenge Goal */}
        <div className="cjc-challenge-goal">
          {steps.toLocaleString()} STEPS IN {days} DAYS!
        </div>

        {/* Reward Information */}
        <div className="cjc-reward-info">
          EARN EXPLORER BADGE AND STARLETS
        </div>

        {/* Central Graphic - 3 Images */}
        <div className="cjc-central-graphic">
          <img 
            src={trophy_4} 
            alt="Left Image" 
            className="cjc-left-image"
          />
          <img 
            src={starlet}
            alt="Center Image" 
            className="cjc-center-image"
          />
          <img 
            src={challenges_robot}
            alt="Right Image" 
            className="cjc-right-image"
          />
        </div>

        {/* Warning Section */}
        <div className="cjc-warning-section">
          <div className="cjc-warning-brackets">
            <div className="cjc-bracket cjc-bracket-tl"></div>
            <div className="cjc-bracket cjc-bracket-tr"></div>
            <div className="cjc-bracket cjc-bracket-bl"></div>
            <div className="cjc-bracket cjc-bracket-br"></div>
          </div>
          
          <div className="cjc-warning-banner">
            WARNING!
          </div>
          
          <div className="cjc-warning-text">
            YOU ARE ABOUT TO ENTER THE WEEKLY CHALLENGE USING {starletsCost} STARLETS.
          </div>

            {/* Join Button */}
            <button className="cjc-join-button" onClick={handleJoinChallenge}>
                JOIN CHALLENGE
            </button>
        </div>

        {/* Challenge End Date */}
        <div className="cjc-challenge-end">
          <span style={{color: '#00FFFF'}}>CHALLENGE END:</span> {challengeEndDate}
        </div>
      </div>
    </div>
  );
};

export default ChallengeJoinConfirmation;
