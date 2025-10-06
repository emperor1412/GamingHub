import React from 'react';
import './ChallengeUpdate.css';
import backIcon from './images/back.svg';

const ChallengeUpdate = ({ 
  challengeData, 
  onDone, 
  onBack 
}) => {
  const {
    challengeEndDate = "DD/MM/YY HH:MM",
    currentSteps = 300,
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
          <p className="cu-description-text">Trek through rugged terrain, overcome steep</p>
          <p className="cu-description-text">challenges, and uncover legendary wonders</p>
          <p className="cu-description-text">along the way.</p>
          <p className="cu-description-text">Complete the quest in time to double your Starlets - but fail, and your hard-earned rewards will be claimed as tribute!</p>
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
              {stepSegments.map((step, index) => (
                <div 
                  key={index}
                  className={`cu-progress-segment ${index < 3 ? 'completed' : 'pending'}`}
                >
                  <span className="cu-segment-number">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shoe Graphic */}
          <div className="cu-shoe-container">
            <div className="cu-shoe-graphic">
              <div className="cu-shoe-outline"></div>
              <div className="cu-energy-lines">
                <div className="cu-line cu-line-1"></div>
                <div className="cu-line cu-line-2"></div>
                <div className="cu-line cu-line-3"></div>
                <div className="cu-line cu-line-4"></div>
                <div className="cu-line cu-line-5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button className="cu-done-button" onClick={handleDone}>
          DONE
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="cu-bottom-nav">
        <div className="cu-nav-item cu-nav-active">
          <div className="cu-nav-icon cu-gamepad-icon">🎮</div>
        </div>
        <div className="cu-nav-item">
          <div className="cu-nav-icon cu-store-icon">💰</div>
        </div>
        <div className="cu-nav-item">
          <div className="cu-nav-icon cu-group-icon">👥</div>
        </div>
        <div className="cu-nav-item">
          <div className="cu-nav-icon cu-cart-icon">🛒</div>
        </div>
        <div className="cu-nav-item">
          <div className="cu-nav-icon cu-profile-icon">👤</div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeUpdate;
