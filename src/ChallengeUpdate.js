import React from 'react';
import './ChallengeUpdate.css';
import backIcon from './images/back.svg';
import shoe_image from './images/shoe_image.png';

const ChallengeUpdate = ({ 
  challengeData, 
  onDone, 
  onBack 
}) => {
  const {
    challengeEndDate = "DD/MM/YY HH:MM",
    currentSteps = 100,
    totalSteps = 500,
    stepSegments = [100, 200, 300, 400, 500]
  } = challengeData || {};

  const handleDone = () => {
    if (onDone) {
      onDone();
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

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
        {/* Challenge Title */}
        <div className="cu-challenge-title">
          <div className="cu-title-background">
            <span className="cu-title-text">WEEKLY</span>
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
          <span className="cu-end-date">{challengeEndDate}</span>
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
              <div className="cu-progress-fill" style={{width: `${(currentSteps / totalSteps) * 100}%`}}></div>
              {/* Segment dividers */}
              {Array.from({ length: 4 }, (_, index) => (
                <div 
                  key={index}
                  className="cu-segment-divider"
                  style={{left: `${((index + 1) / 5) * 100}%`}}
                ></div>
              ))}
            </div>
            {/* Step numbers */}
            <div className="cu-step-numbers">
              {stepSegments.map((step, index) => (
                <span key={index} className="cu-step-number">{step}</span>
              ))}
            </div>
          </div>

          {/* Shoe Graphic */}
          <div className="cu-shoe-container">
            <img src={shoe_image} alt="Shoe" className="cu-shoe-image" />
          </div>
        </div>

        {/* Done Button */}
        <button className="cu-done-button" onClick={handleDone}>
          DONE
        </button>
      </div>
    </div>
  );
};

export default ChallengeUpdate;
