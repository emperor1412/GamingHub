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
  onViewBadges,
  onShowError
}) => {
  const [showChallengeUpdate, setShowChallengeUpdate] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const {
    steps = 56000,
    days = 7,
    starletsCost = 200,
    badgeName = "EXPLORER BADGE",
    challengeEndDate = "DD/MM/YY HH:MM",
    id: challengeId
  } = challengeData || {};

  const handleJoinChallenge = async () => {
    if (!challengeId) {
      console.error('No challenge ID provided');
      return;
    }

    setIsJoining(true);
    
    try {
      const result = await shared.joinChallenge(challengeId);
      
      if (result.success) {
        // Successfully joined challenge
        console.log('Successfully joined challenge');
        setShowChallengeUpdate(true);
      } else if (result.error === 'not_enough_starlets') {
        // Show error screen for not enough starlets
        console.log('Not enough starlets to join challenge');
        if (onShowError) {
          onShowError();
        }
      } else {
        // Other errors
        console.error('Failed to join challenge:', result.error);
        // You can show a generic error message here
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
    } finally {
      setIsJoining(false);
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
            <button 
                className="cjc-join-button" 
                onClick={handleJoinChallenge}
                disabled={isJoining}
            >
                {isJoining ? 'JOINING...' : 'JOIN CHALLENGE'}
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
