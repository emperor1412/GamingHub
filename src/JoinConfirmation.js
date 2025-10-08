import React, { useState } from 'react';
import './JoinConfirmation.css';
import ChallengeUpdate from './ChallengeUpdate';
import shared from './Shared';
import challenges_robot from './images/challenges_robot.png';
import starlet from './images/starlet.png';
import trophy_4 from './images/trophy_4.png';

const JoinConfirmation = ({ 
  challengeData, 
  onJoinChallenge, 
  onBack 
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
      />
    );
  }

  return (
    <div className="join-confirmation-container">
      {/* Background Pattern */}
      <div className="jc-background-pattern"></div>
      
      {/* Main Content */}
      <div className="jc-main-content">
        {/* Challenge Goal */}
        <div className="jc-challenge-goal">
          {steps.toLocaleString()} STEPS IN {days} DAYS!
        </div>

        {/* Reward Information */}
        <div className="jc-reward-info">
          EARN EXPLORER BADGE AND STARLETS
        </div>

        {/* Central Graphic - 3 Images */}
        <div className="jc-central-graphic">
          <img 
            src={trophy_4} 
            alt="Left Image" 
            className="jc-left-image"
          />
          <img 
            src={starlet}
            alt="Center Image" 
            className="jc-center-image"
          />
          <img 
            src={challenges_robot}
            alt="Right Image" 
            className="jc-right-image"
          />
        </div>

        {/* Warning Section */}
        <div className="jc-warning-section">
          <div className="jc-warning-brackets">
            <div className="jc-bracket jc-bracket-tl"></div>
            <div className="jc-bracket jc-bracket-tr"></div>
            <div className="jc-bracket jc-bracket-bl"></div>
            <div className="jc-bracket jc-bracket-br"></div>
          </div>
          
          <div className="jc-warning-banner">
            WARNING!
          </div>
          
          <div className="jc-warning-text">
            YOU ARE ABOUT TO ENTER THE WEEKLY CHALLENGE USING {starletsCost} STARLETS.
          </div>

            {/* Join Button */}
            <button className="jc-join-button" onClick={handleJoinChallenge}>
                JOIN CHALLENGE
            </button>
        </div>

        {/* Challenge End Date */}
        <div className="jc-challenge-end">
          <span style={{color: '#00FFFF'}}>CHALLENGE END:</span> {challengeEndDate}
        </div>
      </div>
    </div>
  );
};

export default JoinConfirmation;
