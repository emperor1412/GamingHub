import React from 'react';
import './ChallengeUpdate.css';
import backIcon from './images/back.svg';
import shoe_image from './images/shoe_image.png';
import ChallengeClaimReward from './ChallengeClaimReward';
import shared from './Shared';

const ChallengeUpdate = ({ 
  challengeData, 
  onDone, 
  onBack,
  onViewBadges,
  onDataRefresh
}) => {
  const [showClaimReward, setShowClaimReward] = React.useState(false);
  
  const {
    // API data
    currentSteps = 0,
    totalSteps = 0,
    endTime = 0,
    startTime = 0,
    id: challengeId = 0,
    // Additional fields from mock/CSV
    stepsEst = 0,
    distanceKm = 0,
    title = "Challenge",
    shortTitle = "Challenge",
    description = "Complete the challenge to earn rewards!",
    location = "Unknown",
    starletsReward = 0,
    challengeEndDate = "DD/MM/YY HH:MM"
  } = challengeData || {};

  // Calculate step segments based on totalSteps
  const stepSegments = totalSteps > 0 ? [
    Math.floor(totalSteps * 0.2),
    Math.floor(totalSteps * 0.4),
    Math.floor(totalSteps * 0.6),
    Math.floor(totalSteps * 0.8),
    totalSteps
  ] : [0, 0, 0, 0, 0];

  // Format end time from API
  const formatEndDate = (endTime) => {
    if (!endTime || endTime === 0) return challengeData.challengeEndDate + ' HH:MM UTC';
    const date = new Date(endTime);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  // Check if user has completed the challenge
  const isChallengeCompleted = currentSteps >= totalSteps && totalSteps > 0;

  const handleDone = () => {
    // Show ChallengeClaimReward instead of calling onDone directly
    setShowClaimReward(true);
  };

  const handleClaimRewards = () => {
    setShowClaimReward(false);
    if (onDone) {
      onDone();
    }
  };

  const handleBackFromClaim = () => {
    setShowClaimReward(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  // Show ChallengeClaimReward if state is true
  if (showClaimReward) {
    return (
      <ChallengeClaimReward
        challengeData={{
          id: challengeId,
          stepsCompleted: currentSteps,
          distanceKm: distanceKm,
          badgeName: `${title}`,
          challengeTitle: shortTitle,
          starletsReward: starletsReward,
          challengeEndDate: formatEndDate(endTime),
          description: description,
          location: location
        }}
        onClaimRewards={handleClaimRewards}
        onBack={handleBackFromClaim}
        onViewBadges={onViewBadges}
        onDataRefresh={onDataRefresh}
      />
    );
  }

  return (
    <div className="challenge-update-container">
      {/* Background Pattern */}
      <div className="cu-background-pattern"></div>
      
      {/* Header */}
      <button className="cu-back-button" onClick={handleBack}>
        <img src={backIcon} alt="Back" />
      </button>

      {/* Main Content */}
      <div className="cu-main-content">
        {/* Challenge Info Container with Corner Decorations */}
        <div className="cu-challenge-info-container">
          {/* Corner Decorations */}
          <div className="cu-corner cu-top-left"></div>
          <div className="cu-corner cu-top-right"></div>
          <div className="cu-corner cu-bottom-left"></div>
          <div className="cu-corner cu-bottom-right"></div>
          
          {/* Challenge Title */}
          <div className="cu-challenge-title">
            <div className="cu-title-background">
              <span className="cu-title-text">{challengeData?.type?.toUpperCase() || "#####"}</span>
            </div>
            <span className="cu-subtitle-text">CHALLENGE</span>
          </div>

          {/* Challenge Description */}
          <div className="cu-challenge-description">
            <div className="cu-description-block">
              <p className="cu-description-text">Trek through rugged terrain, overcome steep</p>
              <p className="cu-description-text">challenges, and uncover legendary wonders</p>
              <p className="cu-description-text">along the way.</p>
            </div>
            <div className="cu-description-block">
              <p className="cu-description-text">Complete the quest in time to double your</p>
              <p className="cu-description-text">Starlets - but fail, and your hard-earned rewards</p>
              <p className="cu-description-text">will be claimed as tribute!</p>
            </div>
          </div>

          {/* Challenge End Date */}
          <div className="cu-challenge-end">
            <span className="cu-end-label">CHALLENGE END:</span>
            <span className="cu-end-date">{formatEndDate(endTime)}</span>
          </div>
        </div>

        {/* Steps Progress Section */}
        <div className="cu-steps-section">
          {/* Steps Box */}
          <div className="cu-steps-box">
            <span className="cu-steps-text">STEPS</span>
          </div>

          {/* Progress Bar */}
          <div className="cu-progress-container">
            <div className="cu-progress-bar">
              <div 
                className="cu-progress-fill" 
                style={{
                  width: `${totalSteps > 0 ? (currentSteps / totalSteps) * 100 : 0}%`
                }}
              ></div>
              {/* Segment dividers */}
              {Array.from({ length: 4 }, (_, index) => (
                <div 
                  key={index}
                  className="cu-segment-divider"
                  style={{left: `${((index + 1) / 5) * 100}%`}}
                ></div>
              ))}
              {/* Step numbers positioned within progress bar */}
              {stepSegments.map((step, index) => (
                <span 
                  key={index} 
                  className="cu-step-number"
                  style={{
                    left: `${10 + (index * 20)}%`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {step.toLocaleString()}
                </span>
              ))}
            </div>
          </div>

          {/* Shoe Graphic */}
          <div className="cu-shoe-container">
            <img src={shoe_image} alt="Shoe" className="cu-shoe-image" />
          </div>
        </div>

        {/* Done Button - Disabled when challenge not completed */}
        <button 
          className={`cu-done-button ${!isChallengeCompleted ? 'cu-done-button-disabled' : ''}`}
          onClick={handleDone}
          disabled={!isChallengeCompleted}
        >
          DONE
        </button>
      </div>
    </div>
  );
};

export default ChallengeUpdate;
